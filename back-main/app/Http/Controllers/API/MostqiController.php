<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\MostAddressesExtendedController as APIMostAddressesExtendedController;
use App\Http\Controllers\API\MostBasicDataController as APIMostBasicDataController;
use App\Http\Controllers\API\MostEnrichmentController as APIMostEnrichmentController;
use App\Http\Controllers\API\MostOndemandRfStatusController as APIMostOndemandRfStatusController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\MostAddressesExtendedController;
use App\Http\Controllers\MostBasicDataController;
use App\Http\Controllers\MostEnrichmentController;
use App\Http\Controllers\MostOndemandRfStatusController;
use App\Models\Beneficios;
use App\Models\DocsValidacaoResultado;
use App\Models\MostEnrichment;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as Psr7Request;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Http\Request ;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Illuminate\Support\Facades\Validator;
use League\CommonMark\Node\Block\Document;
use PhpParser\Node\Expr\Throw_;
use React\Http\Client\Request as HttpClientRequest;
use RingCentral\Psr7\Request as RingCentralPsr7Request;
use Symfony\Component\HttpFoundation\Request as HttpFoundationRequest;

class MostqiController extends Controller
{
    public $url;
    public $host_mostvalid;
    public $client_key;

    public function __construct()
    {
        $this->url = 'https://mostqiapi.com';
        $this->host_mostvalid = 'mostvalid.com.br';
        $this->client_key = '93636cadc45d4e042a1cb5eb8e90612d';
    }

    private function token(){

        try {

            $client = new Client(['verify' => false]);
            $headers = [
                'Content-Type' => 'application/json',
            ];

            $body = '{
                "token": "'.$this->client_key.'"
            }';

            $request = new Psr7Request('POST', $this->url.'/user/authenticate', $headers,$body);

            $response = $client->sendAsync($request)->wait();
            $result = json_decode($response->getBody());

            return $result->token;

        }catch (\Exception $e){
            return '';
        }

    }

    public function contentExtraction(Request $request){
        try {

            if(!$request->hasFile('file')) {
                throw new \Exception("Não foram encontrados arquivos para validar.", 422);
            }

            //busca os dados do Benefício
            $beneficio = Beneficios::findOrFail($request->beneficio);            
            
            //faz a requisição dos dados do CPF
            $this->getEnrichmentSync($beneficio->cpf, $beneficio->id);


            $arquivos = $request->file('file') ;

            foreach($arquivos as $arquivo) {
            
                $req = new Request(['id_beneficio' => $request->beneficio]);
                $req->files->set('file', $arquivo);

                //salva o documento enviado            
                $document =  app(DocumensController::class)->store($req)->getData();
                if($document->status != 'success'){
                    throw new \Exception($document->message, 422);
                }
                
                $idDoc = $document->data->id;

                //obtem o token da API
                $token = $this->token();                

                if ($token === '') {
                    throw new \Exception("Erro ao buscar o token", 422);
                }

                //faz a validação do documento na API
                $client = new Client(['verify' => false]);

                $headers = [
                    'Authorization' => 'Bearer ' . $token
                ];
                
                $multipart = [
                    [
                        'name' => 'file',
                        'contents' => fopen($arquivo->getRealPath(), 'r'),
                        'filename' => $arquivo->getClientOriginalName()
                    ],
                    [
                        'name' => 'returnImage',
                        'contents' => $request->returnImage
                    ],
                    [
                        'name' => 'returnCrops',
                        'contents' => $request->returnCrops
                    ],
                    [
                        'name' => 'tags',
                        'contents' => $request->tags
                    ]
                ];

                $response = $client->request('POST', $this->url.'/process-image/content-extraction', [
                    'headers' => $headers,
                    'multipart' => $multipart
                ]);

                
                $doc = json_decode($response->getBody());

                if($doc->status->code != '200'){
                    throw new \Exception($doc->status->message, 422);
                };

                $etapa = 1;           

                //salva o retorno da validação do documento
                $validacao = $this->saveExtractContent($doc, $beneficio, $idDoc, $etapa);
                if($validacao["status"] != 'success'){
                    throw new \Exception($validacao["message"], 422);
                };            


                unset($req);
            }    

            return json_encode(['status' => 'ok', 'message' => 'Validado com sucesso.', 'code' => 200]);
            // return json_encode($validacao,200);

        } catch (\Exception $e) {
            return json_encode(['status' => 'error', 'message' => $e->getMessage(), 'code' => $e->getCode()]);
        }
    }

    public function getEnrichmentSync($cpf, $id_beneficio){
        try{

            
            $ultimaConsulta = MostEnrichment::select('created_at')->where('id_beneficio',$id_beneficio)->orderBy('id','DESC')->first();

            if(isset($ultimaConsulta) && Carbon::parse($ultimaConsulta->created_at)->diffInHours(now()) < 24 ){
                $req = [
                    'id_beneficio' => $id_beneficio, 
                    'cpf' => $cpf,
                    'requestId' => $id_beneficio,                     
                    'message' => 'IGNORADO'   ,
                    'errors' => 'A última consulta foi a menos de 24 horas'       
                ] ;
    
                $request = new Request($req);
                $most =  app(APIMostEnrichmentController::class)->store($request)->getData();

                return ['status' => 'error', 'id_beneficio' => $id_beneficio, 'message' => 'A última consulta foi a menos de 24 horas.'];
            }  

            $urlServer = env('APP_URL');
            $urlWebhook = $urlServer.'/api/mostqi/retorno-consulta-cpf';
            // $urlWebhook = "https://4050-2804-d55-5573-b500-184b-d0be-e6e7-e28c.ngrok-free.app/api/mostqi/retorno-consulta-cpf";

            $token = $this->token();

            if ($token === '') {
                throw new \Exception("Erro ao buscar o token", 422);
            }

            $client = new Client(['verify' => false]);

            $headers = [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json'
            ];

            $body = [
                "query" => "CARRERA_PF_01",
                "parameters" => ["cpf"=> $cpf],
                "webhook"=> [
                    "url"=> $urlWebhook,
                    "fallbackUrl"=> "",
                    "authorization" => [
                        "headers"=> [],
                        "queryStrings" => []
                    ]
                ]
            ];          

            $request = new Psr7Request('POST', $this->url.'/big-data/enrichment/async', $headers,json_encode($body,JSON_UNESCAPED_SLASHES));

            $response = $client->sendAsync($request)->wait();
            $enrichment = json_decode($response->getBody());

            if($response->getStatusCode() != 200){
                throw new \Exception('Erro ao realizar consulta /big-data/enrichment/async.', 422);
            }
            

            ////exemplo de retorno da API para evitar ficar invocando em testes
            // $exemplo = app(APIMostBasicDataController::class)->getExample();
            // $exemplo = app(APIMostBasicDataController::class)->getExampleAsync();
            // $enrichment = json_decode($exemplo);        

            if($enrichment->status->message !== "Ok"){
                // throw new \Exception($enrichment->status->message, 422); 
                dd($enrichment->status->message);                
            }else{}

            $req = [
                'id_beneficio' => $id_beneficio, 
                'cpf' => $cpf,
                'requestId' => $enrichment->requestId, 
                'elapsedMilliseconds'  => $enrichment->elapsedMilliseconds, 
                'message' => $enrichment->status->message, 
                'code' => $enrichment->status->code, 
                'errors' => $enrichment->status->errors, 
                'processId'  => $enrichment->result->processId                
            ] ;

            $request = new Request($req);
            $most =  app(APIMostEnrichmentController::class)->store($request)->getData();

            $enrichmentId = $most->id;

 
            return ['status' => 'ok', 'id_beneficio' => $id_beneficio, 'enrichment' => $enrichmentId, 'result' => $enrichment];

        }catch (\Exception $e){
            Log::critical($e->getMessage());
            return ['status' => 'error', 'id_beneficio' => $id_beneficio, 'message' => 'getEnrichment() '.$e->getMessage()];
        }
    }

    public function livenessDetect($arquivo, $fileName, $beneficioId, $idDoc, $movements=[""])
    {
        try{
          
            $etapa = 3;
            $token = $this->token();

            if ($token === '') {
                throw new \Exception("Erro ao buscar o token", 422);
            }


            // Lê o conteúdo do arquivo
            $conteudo = fopen($arquivo, 'r');

            if ($conteudo === false) {
                throw new \Exception('Não foi possível recuperar o arquivo', 422);
            }
    
            //Volta o ponteiro do arquivo para o início após leitura para log
            rewind($conteudo);

            // Lê o conteúdo do arquivo
            $fileContent = fread($conteudo, filesize($arquivo));

            // Fecha o arquivo
            fclose($conteudo);

            // Converte o conteúdo do arquivo para base64
            $fileBase64 = base64_encode($fileContent);            

            $curl = curl_init();

            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt_array($curl, array(
                CURLOPT_URL => 'https://mostqiapi.com/liveness/detect',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode([
                    'fileBase64' => $fileBase64,
                    'fileUrl' => '',
                    'movements' => ['left', 'right'],
                    'returnFullFace' => 'false'
                ]),
                CURLOPT_HTTPHEADER => array(
                   'Authorization: Bearer ' . $token,
                   'Content-Type: application/json'
                ),
             ));
            
            $response = curl_exec($curl);

            if (curl_errno($curl)) {
                throw new \Exception('Erro na requisição cURL: ' . curl_error($curl));
            }

            curl_close($curl);

            if ($response === false) {
                throw new \Exception('Falha na requisição cURL', 500);
            }            

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Erro ao decodificar a resposta JSON', 500);
            }            

            $doc = json_decode($response);

            if($doc->status->code != "200"){
                throw new \Exception($doc->status->message, 422);
            };            

            //salva o retorno da validação do documento
            $validacao = $this->saveLivenessDetect($doc, $beneficioId, $idDoc, $etapa);
            
            if($validacao["status"] != 'success'){
                throw new \Exception($validacao["message"], 422);
            }; 

            return $doc;

        }catch (\Exception $e){
            return $e->getMessage();
        }
    }

    private function saveExtractContent($data, $beneficio, $idDoc, $etapa){
        try{

            $documentos = $data->result;            

            foreach ($documentos as $doc){             
                $validado = [
                    "id_beneficio" => $beneficio->id,
                    "etapa"=> $etapa,
                    "status"=> 1,
                    "api_tipo_validacao"=> $doc->processType,
                    "api_id_requisicao"=> $data->requestId,
                    "api_codigo_status"=> $data->status->code,
                    "api_resposta_json"=> json_encode($doc),
                    "api_tipo_documento"=> $doc->type,
                ];

                $request = new Request($validado);
                $validacao =  app(DocsValidacaoController::class)->store($request)->getData();

                if($validacao->status == "success"){
                    $idValidacao = $validacao->data->id;

                    foreach ($doc->fields as $field ){
                        $req =  [
                            'id_docs_validacao' => $idValidacao,
                            'id_docs' => $idDoc,
                            'api_campo_nome' => $field->name ,
                            'api_campo_nome_padrao' => $field->stdName,
                            'api_campo_valor' => $field->value ,
                            'api_campo_score' => $field->score ,
                            'api_global_score' => $doc->score ,
                            // 'api_movimento_score' => $field-> ,
                            // 'api_prova_vida_score' => $field-> ,
                            // 'api_imagem_score' => $field-> ,
                        ];

                        $request = new Request($req);
                        $resultado =  app(DocsValidacaoResultadoController::class)->store($request)->getData();
                    };
                }else{
                    return [
                        'status' => 'error',
                        'message' => 'Falha ao salvar o registro: '.$validacao->message
                    ];                    
                }
            };

            return [
                'status' => 'success',
                'message' => 'Registro salvo com sucesso.'
            ];            

        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Ocorreu um erro ao executar saveExtractContent: ' . $e->getMessage(),
            ];
        }

    }

    private function saveLivenessDetect($data, $beneficioId, $idDoc, $etapa){
        try{

            $liveness = $data->result;            

            $validado = [
                "id_beneficio" => $beneficioId,
                "etapa"=> $etapa,
                "status"=> $liveness->livenessScore > .95 ?  1 : 0 ,
                "api_tipo_validacao"=> 'liveness-detect',
                "api_id_requisicao"=> $data->requestId,
                "api_codigo_status"=> $data->status->code,
                "api_resposta_json"=> json_encode($liveness),
                "api_tipo_documento"=> 'video',
            ];

            $request = new Request($validado);
            $validacao =  app(DocsValidacaoController::class)->store($request)->getData();

            if($validacao->status == "success"){

                $idValidacao = $validacao->data->id;

                $req =  [
                    'id_docs_validacao' => $idValidacao,
                    'id_docs' => $idDoc,
                    'api_global_score' => $liveness->globalScore ,
                    'api_movimento_score' => $liveness->movementScore ,
                    'api_prova_vida_score' => $liveness->livenessScore ,
                    'api_imagem_score' => $liveness->imageScore ,
                ];

                $request = new Request($req);
                $resultado =  app(DocsValidacaoResultadoController::class)->store($request)->getData();

                return [
                    'status' => 'success',
                    'message' => 'Registro salvo com sucesso.'
                ];                  

            }else{
                return [
                    'status' => 'error',
                    'message' => 'Falha ao salvar o registro: '.$validacao->message
                ];                    
            }
   
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Ocorreu um erro ao executar saveLivenessDetect: ' . $e->getMessage(),
            ];
        }

    }    
    
    public function setConsultaCpf(Request $request){
        try {

            $data = json_decode(json_encode($request->all()));

            $cpfData = $this->saveConsultaCpf($data);

            return $cpfData;        

        }catch(\Exception $e){
            return ['status' => 'error', 'message' => 'saveEnrichment() '.$e->getMessage(), 'line' => $e->getLine()];
        }
    }

    private function saveConsultaCpf($data){

            //Obtem o id gerado na consulta
            $processId = $data->processId;
            $enrichment = MostEnrichment::select('*')->where('processId',$processId)->first();

            if(!isset($enrichment)){
                return false;
            };

           if(strtoupper($data->result->status) === 'DOING'){

                sleep(30);
                $statusData = $this->getEnrichmentStatus($processId);

                if(isset($statusData['enrichment'])){
                    $data = json_decode(json_encode($statusData));
                    $data = $data->enrichment;

                    $enrichment->tier = $data->result->tier;
                    $enrichment->query = $data->result->query;
                    $enrichment->status = $data->result->status;
                    $enrichment->save();

                }else{
                    $enrichment->tier = $data->result->tier;
                    $enrichment->query = $data->result->query;
                    $enrichment->status = 'ERROR';
                    $enrichment->save();

                    return false;
                }
           } 

           $enrichment->tier = $data->result->tier;
           $enrichment->query = $data->result->query;
           $enrichment->status = $data->result->status;
           $enrichment->save();

           // Ler os datasets
           $datasets = $data->result->datasets;

           //salvar os datasets
           $result = [];
           foreach($datasets as $dataset){

               unset($most);
               unset($request);

               $dataset->most_enrichment_id = $enrichment->id;

               $request = new Request(Array($dataset));

               switch ($dataset->code) {

                   case 'basic_data_people_862909':                        
                       $most =  app(APIMostBasicDataController::class)->store($request)->getData();                    
                       break;

                   case 'ondemand_rf_status_ondemand_862909':
                       $most =  app(APIMostOndemandRfStatusController::class)->store($request)->getData();
                       break;
                                               
                   case 'addresses_extended_people_862909':
                       $most =  app(APIMostAddressesExtendedController::class)->store($request)->getData();
                       break;

                   default:
                       $most =  (object)['status' => 'error', 'message' =>'Most API ' . $dataset->code . ' não esperado.' ];
                       break;

               }    

               if(!$most ){
                   $result[] = [
                       'dataset'=> $dataset->code,
                       'status' => "error",                       
                       'message' => "Não foi possível salvar o dataset",
                       'id' => null
                   ];
               }else{
                   $result[] = [
                       'dataset'=> $dataset->code,
                       'status' => $most->status,
                       'message' => $most->message,
                       'id' => $most->id
                   ];
               }
               
           };

            return ['status' => 'ok', 'result' => $result];
    }

    private function getEnrichmentStatus($processId){
        $response ='';
        try{
            $token = $this->token();

            if ($token === '') {
                throw new \Exception("Erro ao buscar o token", 422);
            }

            $curl = curl_init();

            curl_setopt_array($curl, array(
            CURLOPT_URL => $this->url.'/big-data/enrichment/async/status',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS =>'{"processId": "'.$processId.'"}',
            CURLOPT_HTTPHEADER => array(
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json'
            ),
            ));
            
            $response = json_decode(curl_exec($curl));
            
            curl_close($curl);
            
            return ['status' => 'ok', 'enrichment' => $response];

        }catch(\Exception $e){
            return ['status' => 'error', 'message' => 'getEnrichmentStatus() '.$e->getMessage(), 'line' => $e->getLine()];
        }
    }
}