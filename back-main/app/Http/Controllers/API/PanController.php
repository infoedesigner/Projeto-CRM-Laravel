<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FunctionsController;
use App\Models\Beneficios;
use App\Models\CondicoesCredito;
use App\Models\CondicoesCreditoDespesas;
use App\Models\CondicoesCreditoParcelas;
use App\Models\CondocoesCredito;
use App\Models\ConsultaComDisponibilidade;
use App\Models\ConsultaCredito;
use App\Models\ParcelasFGTS;
use Carbon\Carbon;
use Ramsey\Uuid\Uuid;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7;

class PanController extends Controller
{

    public $url;
    public $url_token;
    public $cpf;
    public $valor;
    public $user_id;
    public $data_nascimento;
    public $Authorization;
    public $apiKey;

    #"codigo": "9NQSF",
    #"nome": "ADRIELLE PEREIRA DO NASCIMENTO",
    #"identificador": "10182553973_007528",
    #"nome_parceiro": "NOVA PROMOTORA

    public function __construct($cpf,$user_id)
    {
        $this->url_token = 'https://api.bancopan.com.br/consignado/v0/tokens';
        $this->url = 'https://api.bancopan.com.br/openapi/consignado/v2/';

        $this->apiKey = 'l721affb658011420ebac1107a6b4fc2f7';
        $this->Authorization = 'Basic bDcyMWFmZmI2NTgwMTE0MjBlYmFjMTEwN2E2YjRmYzJmNzpjMGRiNDdjNGQzYjg0MTY2YjQ0NmNjYWM1ZWY0Y2JhMA==';
        $this->cpf = $cpf;
        $this->user_id = $user_id;
    }

    public function token(){

        try {

            $client = new Client(['verify' => false]);
            $body = '{
              "username": "05875839910_007528",
              "password": "Carrera20@",
              "grant_type": "client_credentials+password"
            }';
            $request = new Request('POST', $this->url_token, [
                'Content-type' => 'application/json',
                'ApiKey' => $this->apiKey,
                'Authorization' => $this->Authorization,
            ],$body);

            $response = $client->send($request);
            $result = json_decode($response->getBody()->getContents());

            if(!$result->token){
                return json_encode(['status' => true, 'error' => $response]);
            }

            return json_encode(['status' => true, 'token' => $result->token]);

        } catch (\Exception $e) {
            return json_encode(['status'=> false, 'message' => $e->getMessage()]);
        }

    }

    public function getSimulacaoFGTS($params){//$provider,$uuid,$valor,$data_nascimento,$nome

        try {

            $userId = $this->user_id;
            $token = json_decode($this->token());

            if(!$token->status){
                ConsultaCredito::updateOrCreate(
                    [
                        'lead_id' => $params['lead_id']
                    ],
                    [
                        'lead_id' => $params['lead_id'],
                        'cpf' => $this->cpf,
                        'provider' => $params['provider'],
                        'user_id' => $userId,
                        'json_response' => $token->message,
                        'code_response' => 404,
                        'uuid'=>$params['uuid']
                    ]
                );

                return json_encode(['status'=>'error','data'=>json_encode($token),'code'=>400]);
            }

            $client = new Client(['verify' => false]);
            $body = '{
              "cpf_cliente": "'.$this->cpf.'",
              "codigo_promotora": "007528",
              "quantidade_parcelas": "7",
              "incluir_seguro": "false",
              "data_nascimento": "'.$params['data_nascimento'].'"
            }';

            $request = new Request('POST', $this->url.'emprestimos/simulacao/fgts', [
                'Content-type' => 'application/json',
                'ApiKey' => $this->apiKey,
                'Authorization' => 'Bearer '.$token->token,
            ],$body);

            $response = $client->send($request);

            if($response->getStatusCode()===404 || $response->getStatusCode()===400 || $response->getStatusCode()===500){
                $add = ConsultaCredito::updateOrCreate(
                    [
                        'lead_id' => $params['lead_id']
                    ],
                    [
                        'lead_id' => $params['lead_id'],
                        'cpf' => $this->cpf,
                        'provider' => $params['provider'],
                        'user_id' => $userId,
                        'json_response' => $token->message,
                        'code_response' => 404,
                        'uuid'=>$params['uuid']
                    ]
                );

                return json_encode(['status'=>'error','data'=>$response->getBody(),'code'=>$response->getStatusCode()]);
            }

            if($response->getStatusCode()===200){

                $add = ConsultaCredito::updateOrCreate(
                    [
                        'lead_id' => $params['lead_id']
                    ],
                    [
                        'lead_id' => $params['lead_id'],
                        'cpf' => $this->cpf,
                        'provider' => $params['provider'],
                        'user_id' => $userId,
                        'json_response' => $token->message,
                        'code_response' => 404,
                        'uuid'=>$params['uuid']
                    ]
                );
                $id_cc = $add->id;

                $retorno = json_decode($response->getBody());
                $parcelas = $retorno->condicoes_credito;

                foreach($parcelas as $opcoes){
                    if($opcoes->sucesso) {
                        foreach($opcoes->parcelas as $parcela){
                            ParcelasFGTS::create([
                                'id_consulta_credito' => $id_cc,
                                'cpf' => $this->cpf,
                                'uuid' => $params['uuid'],
                                'prazo' => $opcoes->prazo,
                                'codigo_tabela_financiamento' => $opcoes->codigo_tabela_financiamento,
                                'descricao_tabela_financiamento' => $opcoes->descricao_tabela_financiamento,
                                'codigo_produto' => $opcoes->codigo_produto,
                                'descricao_produto' => $opcoes->descricao_produto,
                                'taxa_cet_mensal' => $opcoes->taxa_cet_mensal,
                                'num_parcela' => $parcela->num_parcela,
                                'valor_parcela' => $parcela->valor_parcela,
                                'data_vencimento' => Carbon::parse($parcela->data_vencimento)->format('Y-m-d'),
                                'valor_bruto' => $opcoes->valor_bruto,
                                'valor_cliente' => $opcoes->valor_cliente,
                                'valor_liquido' => $opcoes->valor_liquido,
                                'valor_iof' => $opcoes->valor_iof,
                                'tipo_simulacao' => $opcoes->tipo_simulacao
                            ]);
                        }
                    }
                }

                return json_encode(['status'=>'ok','data'=>$response->getBody(),'code'=>$response->getStatusCode(),'redirect'=>true,'mensagem_liberar'=>false]);
            }

        }catch (ClientException $e){

            $response = $e->getResponse();
            $statusCode = $response->getStatusCode();
            $body = $response->getBody()->getContents();

            $codigo_erro = json_decode($body);

            if($codigo_erro->codigo===7 || $codigo_erro->codigo==="7"){
                return json_encode(['status'=>'ok','data'=>'Erro ao criar o retorno da API Banco Pan.','code'=>$statusCode,'response'=>$response,'body'=>$body,'mensagem_liberar'=>true,'redirect'=>false]);
            }

            return json_encode(['status'=>'error','data'=>'Erro ao criar o retorno da API Banco Pan.','code'=>$statusCode,'response'=>$response,'body'=>$body,'mensagem_liberar'=>false,'redirect'=>false]);
        }

    }

    public function getCreditosByBeneficioId($id,$provider=null){

        try {

            $cc = ConsultaCredito::where('id','=',$id)->where('status','=',1)->first();

            if(is_object($cc)){

                $responses = json_decode($cc->json_response);
                $condicoes_credito = $responses->condicoes_credito;

                foreach ($condicoes_credito as $key => $response){
                    $uuid = Uuid::uuid4();

                    if($response->sucesso){

                        $add = Beneficios::Create([
                            'cc_id' => $cc->id,
                            'provider' => $provider,
                            'cpf' => $cc->cpf,
                            'beneficio' => $response->codigo_tabela_financiamento,
                            'nome' => $cc->nome,
                            'data_nascimento' => $cc->data_nascimento,
                            'dib' => null,
                            'especie' => $response->codigo_produto,
                            'descricao_especie' => $response->descricao_tabela_financiamento,
                            'situacao' => 'ATIVO'
                        ]);

                        if($add) {
                            CondicoesCredito::create([
                                'id_consulta_credito' => $cc->id,
                                'id_beneficio' => $add->id,
                                'prazo' => $response->prazo,
                                'uuid' => $uuid,
                                'descricao_tabela_financiamento' => $response->descricao_tabela_financiamento,
                                'codigo_produto' => $response->codigo_produto,
                                'descricao_produto' => $response->descricao_produto,
                                'taxa_apropriacao_anual' => $response->taxa_apropriacao_anual,
                                'taxa_apropriacao_mensal' => $response->taxa_apropriacao_mensal,
                                'taxa_cet_anual' => $response->taxa_cet_anual,
                                'taxa_cet_mensal' => $response->taxa_cet_mensal,
                                'taxa_referencia_anual' => $response->taxa_referencia_anual,
                                'taxa_referencia_mensal' => $response->taxa_referencia_mensal,
                                'valor_bruto' => $response->valor_bruto,
                                'valor_cliente' => $response->valor_cliente,
                                'valor_financiado' => $response->valor_financiado,
                                'valor_solicitado' => $response->valor_solicitado,
                                'valor_iof' => $response->valor_iof,
                                'valor_liquido' => $response->valor_liquido,
                                'tipo_simulacao' => $response->tipo_simulacao
                            ]);

                            foreach ($response->despesas as $despesa) {
                                CondicoesCreditoDespesas::create([
                                    'id_consulta_credito' => $cc->id,
                                    'uuid' => $uuid,
                                    'despesas_codigo' => $despesa->codigo,
                                    'despesas_grupo' => $despesa->grupo,
                                    'despesas_financiada' => $despesa->financiada,
                                    'despesas_tipo' => $despesa->tipo,
                                    'despesas_inclusa' => $despesa->inclusa,
                                    'despesas_numero_item' => $despesa->numero_item,
                                    'despesas_valor_calculado' => $despesa->valor_calculado
                                ]);
                            }

                            foreach ($response->parcelas as $parcela) {
                                CondicoesCreditoParcelas::create([
                                    'id_consulta_credito' => $cc->id,
                                    'uuid' => $uuid,
                                    'parcelas_num_parcela' => $parcela->num_parcela,
                                    'parcelas_valor_parcela' => $parcela->valor_parcela,
                                    'parcelas_data_vencimento' => $parcela->data_vencimento,
                                ]);
                            }

                        }

                    }

                }

                ConsultaCredito::where('id','=',$cc->id)->update(['status'=>2]);

            }else{
                \Log::info('Benefício não encontrado no processamento da API Banco Pan');
            }

        }catch (\Exception $e){
            \Log::error('Erro ao criar o retorno da API Banco Pan '.$e->getMessage());
        }

    }

}
