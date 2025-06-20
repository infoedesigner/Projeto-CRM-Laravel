<?php

namespace App\Http\Controllers\API;

use App\Models\APIsErrors;
use App\Utils\Constants;
use DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\FunctionsController;
use App\Models\Beneficios;
use App\Models\Cliente;
use App\Models\ConsultaComDisponibilidade;
use App\Models\ConsultaCredito;
use App\Models\INSSHistoryContratosEmprestimo;
use App\Models\INSSHistoryDadosBancarios;
use App\Models\INSSHistoryMargem;
use App\Models\XMLCredito;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class DataConsigV2Controller extends Controller
{

    public $url;
    public $apiKey1;
    public $apiKey2;
    public $cpf;
    public $user_id;
    public $id_lead;

    public function __construct($cpf=null,$user_id=null,$id_lead=null)
    {
        $this->url = 'https://inss.api.dataconsig.com.br/v1/';
        $this->apiKey1 = 'f5df24ee9abe38f6d9c2ed1b658b769f';
        $this->apiKey2 = '8b7e34171997c474bf14455379ffa9b7';
        $this->cpf = $cpf;
        $this->user_id = $user_id;
        $this->id_lead = $id_lead;
    }

    public function checkClientExists($cpf,$nome,$data_nascimento){

        //Ajustes de verificação cliente
        $cliente = Cliente::where('cpf','=',FunctionsController::onlyNumbers($cpf))->first();

        if(is_object($cliente)){
            return $cliente->id;
        }else{
            $add = Cliente::updateOrCreate([
                'id_lead' => $this->id_lead,
                'cpf' => $cpf,
            ],
                [
                'id_lead' => $this->id_lead,
                'nome' => $nome,
                'cpf' => FunctionsController::onlyNumbers($cpf),
                'data_nascimento' => $data_nascimento
            ]);
            return $add->id;
        }
    }

    public function getQtdeBeneficiosValidos($cpf){

        try {

            $qtdeBeneficiosValidos = DB::table('beneficios_cpf')
                ->where('cpf','=',$cpf)
                ->whereNotIn('especie', Constants::BLOQUEADOS_INSS)
                ->count();

            return $qtdeBeneficiosValidos;

        }catch (\Exception $e){
            return 0;
        }

    }

    public function getIdBeneficioByNumBeneficio($beneficio,$cpf){

        $beneficio = Beneficios::where('beneficio','=',$beneficio)->where('cpf','=',$cpf)->first();
        return is_object($beneficio) ? $beneficio->id : null;

    }

    public function getBeneficiosByCPF($provider=null,$uuid=null,$force=0,$tentativa=1){

        try {

            $userId = $this->user_id;
            $CPF = trim(FunctionsController::onlyNumbers($this->cpf));

            $client = new Client(['verify' => false]);

            $request = $client->get($this->url."inss/beneficios/$CPF", [
                'debug' => false,
                'http_errors' => false,
                'headers' => [
                    'Content-type' => 'application/json',
                    'X-Api-Key' => $this->apiKey2,
                ]
            ]);

            if($request->getStatusCode()===200 || $request->getStatusCode() == "200"){

                $CC = ConsultaCredito::updateOrCreate([
                    'cpf' => $CPF,
                    'provider' => $provider,
                ],[
                    'cpf' => $CPF,
                    'provider' => $provider,
                    'user_id' => $userId,
                    'json_response' => $request->getBody(),
                    'code_response' => $request->getStatusCode(),
                    'uuid'=>$uuid,
                    'lead_id' => $this->id_lead,
                    'status' => 1
                ]);

                if($this->getCreditosByBeneficioId($CC->id,$provider,$uuid,$force)){
                    ConsultaCredito::where('id','=',$CC->id)->update(['status'=>2,'tentativa'=>$tentativa]);
                }

                return json_encode(['status'=>'ok','message'=>'Sucesso, benefícios atualizados'],200);

            }else{
                if($tentativa <= 3) {
                    \Log::critical("Tentativa $tentativa do benefício $CPF");
                    sleep(3);
                    $tentativa++;
                    $this->getBeneficiosByCPF($provider, $uuid, $force, $tentativa);
                }else{
                    return json_encode(['status'=>'error','message'=>'erro ao buscar os benefícios'],200);
                }

            }

        }catch (\Exception $e){
            \Log::critical('Erro ao consultar os benefícios by CPF'.$e->getMessage().'##'.$e->getLine());
            return json_encode(['status'=>'error','message'=>$e->getMessage(),'error_code'=>422],422);
        }

    }

    public function segmentacaoLeadBom($beneficio,$uuid,$cpf){

        $checkXMLOffline = XMLCredito::where('cpf','=',$cpf)
            ->where('beneficio','=',$beneficio)
            ->where('tipo','=','offline')
            ->first();

        if(is_null($checkXMLOffline)){
            $this->getCreditoOffline($beneficio,$uuid);
        }

        $checkXMLOnline = XMLCredito::where('cpf','=',$cpf)
            ->where('beneficio','=',$beneficio)
            ->where('tipo','=','offline')
            ->first();

        if(is_object($checkXMLOnline)){

            $xml = json_decode($checkXMLOnline->json_response);

            $margemDisponivelEmprestimo = isset($xml->margem->margemDisponivelEmprestimo) ? $xml->margem->margemDisponivelEmprestimo : 0.00;
            $percentualMargemDisponivelEmprestimo = isset($xml->margem->percentualMargemDisponivelEmprestimo) ? $xml->margem->percentualMargemDisponivelEmprestimo : 0.00;
            $margemDisponivelCartao = isset($xml->margem->margemDisponivelCartao) ? $xml->margem->margemDisponivelCartao : 0.00;

            $margemDisponivel = $percentualMargemDisponivelEmprestimo > 0 ? ($margemDisponivelEmprestimo * $percentualMargemDisponivelEmprestimo/100)*0.0268500 : 0.00;
            $possuiCartao = isset($xml->margem->possuiCartao) ? $xml->margem->possuiCartao : 0.00;
            $possuiCartaoBeneficio = isset($xml->margem->possuiCartaoBeneficio) ? $xml->margem->possuiCartaoBeneficio : 0.00;

            $beneficioPermiteEmprestimo = $xml->beneficioPermiteEmprestimo;

            if($beneficioPermiteEmprestimo == false){
                return false;
            }


            if($margemDisponivel > Constants::VALOR_MINIMO_INSS){
                return true;
            }

            if(!$possuiCartaoBeneficio || !$possuiCartao){
                return true;
            }

        }

        return false;

    }

    public function getCreditosByBeneficioId($id,$provider=null,$uuid=null,$force=0){

        try {

            $cc = ConsultaCredito::where('id','=',$id)->first();

            if(is_object($cc)){

                $json = json_decode($cc->json_response);

                if(isset($json->beneficios)){
                    foreach($json->beneficios as $beneficio){

                        $add['cpf'] = $json->cpf ?? null;
                        $add['provider'] = $provider;
                        $add['cc_id'] = $cc->id;
                        $add['beneficio'] = $beneficio->beneficio ?? null;
                        $add['nome'] = $beneficio->nome ?? null;
                        $add['data_nascimento'] = $beneficio->dataNascimento ?? null;
                        $add['dib'] = $beneficio->dib ?? null;
                        $add['especie'] = $beneficio->especie->codigo ?? null;
                        $add['descricao_especie'] = $beneficio->especie->descricao ?? null;
                        $add['situacao'] = $beneficio->situacao ?? null;
                        $add['uuid'] = $uuid;
                        $add['check_contratos'] = 0;
                        $add['check_credito'] = 0;

                        $addBeneficio = Beneficios::updateOrCreate([
                            'cpf' => $add['cpf'],
                            'beneficio' => $add['beneficio'],
                        ],$add);

                        $bloqueados = Constants::BLOQUEADOS_INSS;
                        $check = strpos(trim($beneficio->situacao), 'ATIVO');

                        $checkSegmentacao = $this->segmentacaoLeadBom($add['beneficio'],$uuid,$add['cpf']);

                        if($check !== false && $checkSegmentacao) {

                            if(!in_array((int)$addBeneficio->especie,$bloqueados)){
                                if ($this->getCreditoOnline($beneficio->beneficio, $addBeneficio->id, $uuid, 0,0)) {
                                    Beneficios::where('id', '=', $addBeneficio->id)->update(['status' => 2]);
                                }
                            }

                        }

                    }
                }

                return true;
            }else{
                \Log::critical('Sem consulta_credito para realizar.');
                return false;
            }

        }catch (\Exception $e){

            \Log::error('Erro ao criar o retorno da API DataConsig '.$e->getMessage().'##'.$e->getLine());
            return false;
        }

    }

    public function getCreditoOnline($beneficio,$idBeneficio,$uuid,$user_force=0,$tentativa=1){

        try {

            $client = new Client(['verify' => false]);

            $url_consulta = $this->url."inss/margem/cpf/".$this->cpf."/beneficio/".$beneficio;

            $request = $client->get($url_consulta, [
                'debug' => false,
                'http_errors' => false,
                'headers' => [
                    'Content-type' => 'application/json',
                    'X-Api-Key' => $this->apiKey1,
                ]
            ]);

            if((int)$request->getStatusCode()===200 || $request->getStatusCode()=="200"){

                XMLCredito::updateOrCreate([
                    'id_beneficio'=>$idBeneficio,
                    'tipo'=>'online'
                ],[
                    'id_beneficio'=>$idBeneficio,
                    'cpf'=>$this->cpf,
                    'beneficio'=>$beneficio,
                    'json_response'=>$request->getBody(),
                    'tipo'=>'online'
                ]);

                $response = json_decode($request->getBody());

                if(is_object($response)){

                    $idCliente = $this->checkClientExists($response->cpf,$response->nome,$response->dataNascimento);

                    foreach ($response->beneficios as $bn){

                        $add = INSSHistoryMargem::updateOrCreate([
                            'id_cliente' => $idCliente,
                            'id_beneficio' => $idBeneficio,
                            'tipo' => 'online'
                        ],[
                            'id_cliente' => $idCliente,
                            'id_beneficio' => $idBeneficio,
                            'situacao_beneficio' => $bn->situacaoBeneficio ?? null,
                            'uuid' => $uuid ?? null,
                            'nit' => $bn->nit ?? null,
                            'identidade' => $bn->identidade ?? null,
                            'sexo' => $bn->sexo ?? null,
                            'uf' => $response->uf ?? null,
                            'dib' => $bn->dib ?? null,
                            'valor_beneficio' => $bn->valorBeneficio ?? null,
                            'possui_representante_legal' => $bn->possuiRepresentanteLegal ?? null,
                            'bloqueio_emprestimo' => $bn->bloqueioEmprestimo ?? null,
                            'beneficio_permite_emprestimo' => $bn->beneficioPermiteEmprestimo ?? null,
                            //Margem
                            'margem_disponivel_emprestimo' => $bn->margemDisponivelEmprestimo ?? null,
                            'margem_quantidade_emprestimo' => $bn->quantidadeEmprestimo ?? null,
                            'margem_possui_cartao' => $bn->possuiCartao ?? null,
                            'margem_margem_disponivel_cartao' => $bn->margemDisponivelCartao ?? null,
                            'margem_possui_cartao_beneficio' => $bn->possuiCartaoBeneficio ?? null,
                            'margem_disponivel_cartao_beneficio' => $bn->margemDisponivelCartaoBeneficio ?? null,
                            'representante_legal_nome' => $bn->representanteLegalNome ?? null,
                            'pensao_alimenticia' => $bn->margemDisponivelCartaoBeneficio ?? null,
                            'tipo' => 'online'
                        ]);

                        INSSHistoryDadosBancarios::updateOrCreate([
                            'id_cliente' => $idCliente,
                            'id_beneficio' => $idBeneficio,
                        ],[
                            'id_cliente' => $idCliente,
                            'id_beneficio' => $idBeneficio,
                            //Dados bancários
                            'banco_codigo' => $bn->dadosBancarios->banco->codigo ?? null,
                            'banco_nome' => $bn->dadosBancarios->banco->nome ?? null,
                            //Dados bancários agência
                            'agencia_codigo' => $bn->dadosBancarios->agencia->codigo ?? null,
                            'agencia_nome' => $bn->dadosBancarios->agencia->nome ?? null,
                            'agencia_endereco_logradouro' => $bn->dadosBancarios->agencia->endereco->endereco ?? null,
                            'agencia_endereco_bairro' => $bn->dadosBancarios->agencia->endereco->bairro ?? null,
                            'agencia_endereco_cidade' => $bn->dadosBancarios->agencia->endereco->cidade ?? null,
                            'agencia_endereco_cep' => $bn->dadosBancarios->agencia->endereco->cep ?? null,
                            'agencia_endereco_uf' => $bn->dadosBancarios->agencia->endereco->uf ?? null,
                            'agencia_orgao_pagador' => $bn->dadosBancarios->agencia->orgaoPagador ?? null,
                            //Dados bancários meio pagamento
                            'meio_pagamento_tipo' => $bn->dadosBancarios->meioPagamento->tipo ?? null,
                            'meio_pagamento_numero' => $bn->dadosBancarios->meioPagamento->numero ?? null,
                        ]);

                        if(is_object($add)){
                            return true;
                        }

                    }

                }else{
                    return false;
                }

            }else{

                if($tentativa <= 3){
                    sleep(3);
                    $tentativa++;
                    $this->getCreditoOnline($beneficio,$idBeneficio,$uuid,$user_force,$tentativa);
                }else {

                    $this->getCreditoOffline($beneficio,$uuid);

                    APIsErrors::create([
                        'cpf' => $this->cpf,
                        'error' => $request->getBody(),
                        'error_code' => $request->getStatusCode(),
                        'provedor' => 'Dataconsig',
                        'url' => $url_consulta
                    ]);
                }

                return false;
            }

        }catch (\Exception $e){
            return false;
        }


    }

    public function getCreditoOffline($beneficio,$uuid){

        try {

            $client = new Client(['verify' => false]);

            $request = $client->get($this->url."inss/historico/offline/".$beneficio, [
                'debug' => false,
                'http_errors' => false,
                'headers' => [
                    'Content-type' => 'application/json',
                    'X-Api-Key' => $this->apiKey2,
                ]
            ]);

            if($request->getStatusCode()==200){

                $response = json_decode($request->getBody());

                if(is_object($response)){

                    $idCliente = $this->checkClientExists($response->cpf,$response->nome,$response->dataNascimento);
                    $idBeneficio = $this->getIdBeneficioByNumBeneficio($response->beneficio,$response->cpf);

                    XMLCredito::updateOrCreate([
                        'id_beneficio'=>$idBeneficio,
                        'tipo'=>'offline'
                    ],[
                        'id_beneficio'=>$idBeneficio,
                        'cpf'=>$this->cpf,
                        'beneficio'=>$beneficio,
                        'json_response'=>$request->getBody(),
                        'tipo'=>'offline'
                    ]);

                    $add = INSSHistoryMargem::updateOrCreate([
                        'id_cliente' => $idCliente,
                        'id_beneficio' => $idBeneficio,
                        'tipo' => 'offline'
                    ],[
                        'id_cliente' => $idCliente,
                        'id_beneficio' => $idBeneficio,
                        'situacao_beneficio' => $response->situacaoBeneficio ?? null,
                        'uuid' => $uuid ?? null,
                        'nit' => $response->nit ?? null,
                        'identidade' => $response->identidade ?? null,
                        'sexo' => $response->sexo ?? null,
                        'uf' => $response->uf ?? null,
                        'dib' => $response->dib ?? null,
                        'valor_beneficio' => $response->valorBeneficio ?? null,
                        'possui_representante_legal' => $response->possuiRepresentanteLegal ?? null,
                        'bloqueio_emprestimo' => $response->bloqueioEmprestimo ?? null,
                        'beneficio_permite_emprestimo' => $response->beneficioPermiteEmprestimo ?? null,
                        //Margem
                        'margem_disponivel_emprestimo' => $response->margem->percentualMargemDisponivelEmprestimo > 0 ? ($response->margem->baseCalculoMargemConsignavel ?? 0) * ($response->margem->percentualMargemDisponivelEmprestimo/100) : 0.00,
                        'margem_quantidade_emprestimo' => $response->margem->quantidadeEmprestimo ?? null,
                        'margem_possui_cartao' => $response->margem->possuiCartao ?? null,
                        'margem_margem_disponivel_cartao' => $response->margem->margemDisponivelCartao ?? null,
                        'margem_possui_cartao_beneficio' => $response->margem->possuiCartaoBeneficio ?? null,
                        'margem_disponivel_cartao_beneficio' => $response->margem->margemDisponivelCartaoBeneficio ?? null,
                        'representante_legal_nome' => $response->representanteLegalNome ?? null,
                        'pensao_alimenticia' => $response->margemDisponivelCartaoBeneficio ?? null,
                        'tipo' => 'offline'
                    ]);

                    $addDadosBancarios = INSSHistoryDadosBancarios::updateOrCreate([
                        'id_cliente' => $idCliente,
                        'id_beneficio' => $idBeneficio
                    ],[
                        'id_cliente' => $idCliente,
                        'id_beneficio' => $idBeneficio,
                        //Dados bancários
                        'banco_codigo' => $response->dadosBancarios->banco->codigo ?? null,
                        'banco_nome' => $response->dadosBancarios->banco->nome ?? null,
                        //Dados bancários agência
                        'agencia_codigo' => $response->dadosBancarios->agencia->codigo ?? null,
                        'agencia_nome' => $response->dadosBancarios->agencia->nome ?? null,
                        'agencia_endereco_logradouro' => $response->dadosBancarios->agencia->endereco->endereco ?? null,
                        'agencia_endereco_bairro' => $response->dadosBancarios->agencia->endereco->bairro ?? null,
                        'agencia_endereco_cidade' => $response->dadosBancarios->agencia->endereco->cidade ?? null,
                        'agencia_endereco_cep' => $response->dadosBancarios->agencia->endereco->cep ?? null,
                        'agencia_endereco_uf' => $response->dadosBancarios->agencia->endereco->uf ?? null,
                        'agencia_orgao_pagador' => $response->dadosBancarios->agencia->orgaoPagador ?? null,
                        //Dados bancários meio pagamento
                        'meio_pagamento_tipo' => $response->dadosBancarios->meioPagamento->tipo ?? null,
                        'meio_pagamento_numero' => $response->dadosBancarios->meioPagamento->numero ?? null,
                    ]);

                    if(isset($response->contratosEmprestimo)) {

                        $emprestimos = $response->contratosEmprestimo;
                        foreach ($emprestimos as $emprestimo) {
                            $addContratosEmprestismo = INSSHistoryContratosEmprestimo::updateOrCreate([
                                'id_cliente' => $idCliente,
                                'id_beneficio' => $idBeneficio,
                            ], [
                                    'id_cliente' => $idCliente,
                                    'id_beneficio' => $idBeneficio,
                                    'contrato' => $emprestimo->contrato,
                                    'tipo_emprestimo_codigo' => $emprestimo->tipoEmprestimo->codigo,
                                    'tipo_emprestimo_descricao' => $emprestimo->tipoEmprestimo->descricao,
                                    'banco_codigo' => $emprestimo->banco->codigo,
                                    'banco_nome' => $emprestimo->banco->nome,
                                    'data_inicio_contrato' => $emprestimo->dataInicioContrato,
                                    'competencia_inicio_desconto' => $emprestimo->competenciaInicioDesconto,
                                    'competencia_fim_desconto' => $emprestimo->competenciaFimDesconto,
                                    'data_inclusao' => $emprestimo->dataInclusao,
                                    'situacao' => $emprestimo->situacao,
                                    'excluido_aps' => $emprestimo->excluidoAps,
                                    'excluido_banco' => $emprestimo->excluidoBanco,
                                    'valor_emprestado' => $emprestimo->valorEmprestado,
                                    'valor_parcela' => $emprestimo->valorParcela,
                                    'quantidade_parcelas' => $emprestimo->quantidadeParcelas,
                                    'quantidade_parcelas_emaberto' => $emprestimo->quantidadeParcelasEmAberto,
                                    'saldo_quitacao' => $emprestimo->saldoQuitacao,
                                    'taxa' => $emprestimo->taxa
                                ]
                            );
                        }

                    }

                    return true;

                }else{
                    return false;
                }

            }

        }catch (\Exception $e){
            \Log::critical('Erro ao consultar o offline');
            return false;
        }

    }

    public function reprocessConsultaOnline(Request $request){

        $beneficio = $request->beneficio;
        $idBeneficio = $request->idBeneficio;
        $uuid = $request->uuid;
        $cpf = $request->cpf;
        $user_force= $request->user_force;

        $consulta = new DataConsigV2Controller($cpf);
        if($consulta->getCreditoOnline($beneficio,$idBeneficio,$uuid,$user_force)){
            return response()->json(['status'=>'ok','message'=>'Consulta reprocessada com sucesso.'],200);
        }else{
            return response()->json(['status'=>'error','message'=>'Consulta reprocessada com sucesso.'],400);
        }

    }

}
