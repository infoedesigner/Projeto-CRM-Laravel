<?php

namespace App\Http\Controllers\API;

use App\Jobs\SendMailLeadJob;
use App\Models\HistoricoClassificacaoLead;
use DB;
use App\Mail\DocumentosMail;
use App\Mail\ErrorCoeficiente;
use App\Models\APIsErrors;
use App\Models\Cliente;
use App\Models\Coeficiente;
use App\Models\EsteiraProposta;
use App\Models\ParcelasFGTS;
use App\Models\Produto;
use App\Http\Controllers\FunctionsController;
use App\Mail\LandingPageMail;
use App\Models\Banco;
use App\Models\Beneficios;
use App\Models\ConsultaCredito;
use App\Models\Lead;
use App\Models\Tabela;
use App\Utils\Constants;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Ramsey\Uuid\Uuid;
use Illuminate\Http\Request;

class LandingPageController extends Controller
{

    public $url;
    public $cpf;
    public $user_id;

    public function __construct($cpf=null,$user_id=null)
    {
        $this->cpf = $cpf;
        $this->user_id = $user_id;
    }

    public function getDataNascimento($objeto) {
        if (property_exists($objeto, 'beneficios') && is_array($objeto->beneficios)) {
            foreach ($objeto->beneficios as $beneficio) {
                if (property_exists($beneficio, 'dataNascimento')) {
                    return $beneficio->dataNascimento;
                }
            }
        }

        return '2000-01-01';
    }

    public function changeSimulacao(Request $request){

        $valor = FunctionsController::toMoney($request->valor);

        $lead = Lead::where('uuid','=',$request->uuid)->update(['valor'=>$valor]);

        return response()->json($lead);

    }

    public function bloqueiaConsultaPorTempo($CPF){

        try {

            $check = DB::table('consulta_credito')
                ->selectRaw('TIMESTAMPDIFF(HOUR,created_at,NOW()) as horas, uuid')
                ->where('cpf','=',$CPF)
                ->whereBetween('created_at',[Carbon::now()->startOfDay()->format('Y-m-d H:i:s'), Carbon::now()->endOfDay()->format('Y-m-d H:i:s')])
                ->orderBy('created_at','DESC')
                ->first();

            if(is_object($check)) {

                $horas = $check->horas;

                if((int)$horas <= 24){
                    return ['status'=>'bloqueado','uuid'=>$check->uuid];
                }else{
                    return ['status'=>'liberado','uuid'=>null];
                }

            }else{
                return ['status'=>'liberado','uuid'=>null];
            }

        }catch (\Exception $e){
            return ['status'=>'liberado','uuid'=>null];
        }

    }

    public function criaOuAtualizaLead(int $cpf, array $data,$historico=true){

        $lead = Lead::updateOrCreate(['cpf' => $cpf], $data);

        if($historico) {
            HistoricoClassificacaoLead::create([
                'lead_id' => $lead->id,
                'categoria' => $lead->categoria
            ]);
        }

        return $lead;
    }

    public function checkCreditByLeadFGTS($lead,$uuid){

        $data = [
            'nome' => $lead->nome,
            'cpf' => $lead->cpf,
            'email' => $lead->email,
            'celular' => $lead->celular,
            'produto' => $lead->produto,
            'valor' => $lead->valor,
            'canal' => 'landingpage',
            'uuid' => $uuid,
            'ip' => $lead->ip,
            'data_nascimento' => $lead->data_nascimento
        ];

        if($lead->valor <= Constants::VALOR_MINIMO_FGTS){

            $data['code'] = 'VALOR < '.Constants::VALOR_MINIMO_FGTS;
            $data['categoria'] = 'desqualificado';

            $this->criaOuAtualizaLead($lead->cpf, $data,false);

            SendMailLeadJob::dispatch((array)$data)->delay(now()->addMinutes(5));

            return response()->json(['status'=>'ok','message'=>'Crédito não disponível, para contratação do INSS, o valor mínimo é de R$ '.Constants::VALOR_MINIMO_FGTS,'redirect'=>false,'mensagem_liberar'=>'Valor mínimo','uuid'=>$uuid,'produto'=>$lead->produto],200);

        }

        $dataConsig = new DataConsigV2Controller($lead->cpf,1,$lead->id);
        $beneficios = $dataConsig->getBeneficiosByCPF(6,$uuid);

        $pan = new PanController($lead->cpf,1);

        $parametros = [
            'lead_id' => $lead->id,
            'provider' => 2,
            'cpf' => $lead->cpf,
            'nome' => $lead->nome,
            'data_nascimento' => $lead->data_nascimento,
            'valor' => $lead->valor,
            'uuid' => $uuid
        ];

        $retorno = $pan->getSimulacaoFGTS($parametros);//$provider,$uuid,$valor,$data_nascimento,$nome
        $retorno = json_decode($retorno);

        if($retorno->status === 'ok'){

            SendMailLeadJob::dispatch((array)$data)->delay(now()->addMinutes(5));

            return response()->json(['status'=>'ok','message'=>'Tudo certo','redirect'=>$retorno->redirect,'mensagem_liberar'=>$retorno->mensagem_liberar,'uuid'=>$uuid,'produto'=>$lead->produto],200);

        }else{

            SendMailLeadJob::dispatch((array)$data)->delay(now()->addMinutes(5));

            return response()->json(['status'=>'ok','message'=>'Erro na consulta FGTS','redirect'=>false,'mensagem_liberar'=>'Erro na consulta FGTS','uuid'=>$uuid,'produto'=>$lead->produto],200);

        }

    }

    public function checkCreditByLeadINSS($lead,$uuid,$lp=false){

        $segmentacao = new SegmentacaoController();
        $lead = $this->criaOuAtualizaLead($lead->cpf, (array)$lead,false);
        $totalValido = 0;

        $dataConsig = new DataConsigV2Controller($lead->cpf,1,$lead->id);
        $beneficios = json_decode($dataConsig->getBeneficiosByCPF(6,$uuid));

        if(is_null($beneficios)){
            return response()->json(['status'=>'error','message'=>'No momento infelizmente para seu CPF não conseguimos limite de crédito [Erro na consulta INSS]','uuid'=>$uuid,'redirect'=>false],200);
        }

        if($beneficios->status == 'ok'){

            $CC = ConsultaCredito::where('cpf','=',$lead->cpf)->first();

            //Início check desqualifica por idade
            $dataNascimento = $this->getDataNascimento(json_decode($CC->json_response));
            if(!$segmentacao->checkIdade($dataNascimento,'INSS')){

                $lead->code = 'INSS IDADE > '.Constants::MAX_IDADE;
                $lead->categoria = 'desqualificado';
                $lead->save();

                SendMailLeadJob::dispatch((array)$lead)->delay(now()->addMinutes(5));

                return response()->json(['status' => 'error', 'message' => 'No momento infelizmente para seu CPF não conseguimos limite de crédito [AGE].', 'uuid' => $uuid,'CB'=>[],'code'=>$lead->code,'redirect'=>false], 200);

            }

            //Início check desqualifica por espécie
            if($dataConsig->getQtdeBeneficiosValidos($lead->cpf) <= 0) {

                $lead->code = 'Benefício bloqueado';
                $lead->categoria = 'desqualificado';
                $lead->save();

                SendMailLeadJob::dispatch((array)$lead)->delay(now()->addMinutes(5));

                return response()->json(['status' => 'error', 'message' => 'No momento infelizmente para seu CPF não conseguimos limite de crédito [BB].', 'uuid' => $uuid,'CB'=>[],'code'=>$lead->code,'redirect'=>false], 200);

            }

            if($lp==true){

                $esteira = new EsteiraPropostasController();

                $beneficios = DB::table('beneficios_cpf as B')
                    ->join('inss_historico_margem AS M','M.id_beneficio','=','B.id')
                    ->selectRaw('B.*, M.margem_disponivel_emprestimo')
                    ->where('B.situacao','LIKE','%ATIVO%')
                    ->whereNotIn('B.especie',Constants::BLOQUEADOS_INSS)
                    ->where('B.cpf','=',$lead->cpf)
                    ->get();

                if(sizeof($beneficios) <= 0){
                    return response()->json(['status' => 'error', 'message' => 'No momento infelizmente para seu CPF não conseguimos limite de crédito [EST.].', 'uuid' => $uuid,'CB'=>[],'code'=>$lead->code,'redirect'=>false], 200);
                }

                foreach ($beneficios as $beneficio) {
                    $simulacao = $esteira->simulacoes($beneficio->id, date('Y-m-d'), null, $beneficio->margem_disponivel_emprestimo);
                    $simulacao = $simulacao->original;
                    $totalValido += sizeof($simulacao['simulacoes']);
                }

                if($totalValido <= 0){

                    $lead->code = 'INSS 200';
                    $lead->categoria = 'qualificado';
                    $lead->save();

                    return response()->json(['status' => 'error', 'message' => 'No momento infelizmente para seu CPF não conseguimos limite de crédito [TOTAL].', 'uuid' => $uuid,'CB'=>[],'code'=>$lead->code,'redirect'=>false], 200);
                }

            }

            $lead->code = 'INSS 200';
            $lead->categoria = 'qualificado';
            $lead->save();

            SendMailLeadJob::dispatch((array)$lead)->delay(now()->addMinutes(5));

            return response()->json(['status'=>'ok','message'=>'Simulação solicitada com sucesso. Aguarde, você vai ser redirecionado...','uuid'=>$uuid,'redirect'=>true,'produto'=>$lead->produto,'mensagem_liberar'=>false],200);

        }else{

            $lead->code = 'DATACONSIG NÃO ENCONTRADO';
            $lead->categoria = 'desqualificado';
            $lead->save();

            APIsErrors::create([
                'provedor' => 6,
                'error' => $beneficios->message,
                'error_code' => $beneficios->error_code,
                'cpf' => $lead->cpf,
            ]);

            return response()->json(['status'=>'error','message'=>'Erro na consulta INSS','uuid'=>$uuid,'redirect'=>false],200);
        }

    }

    public function leads(Request $request){

        $produto = strtoupper($request->produto);
        $CPF = trim(FunctionsController::onlyNumbers($request->cpf));
        $checkValor = trim(FunctionsController::toMoney($request->valor));
        $uuid = Uuid::uuid4()->toString();
        $ip = $request->ip();
        $lp = isset($request->lp) && $request->lp == 'ok' ? true : false;

        $lead = (object) [
            'nome' => $request->nome,
            'cpf' => $CPF,
            'email' => $request->email,
            'celular' => $request->celular,
            'produto' => $produto,
            'valor' => $checkValor,
            'canal' => 'landingpage',
            'uuid' => $uuid,
            'ip' => $ip,
            'categoria' => 'begin',
            'data_nascimento' => isset($request->data_nascimento) ? Carbon::createFromFormat('d/m/Y',$request->data_nascimento)->format('Y-m-d') : '1970-01-01',
        ];

        $produto = Produto::where('lp_code','=',$produto)->first();
        if(is_object($produto)) {
            $tipoProduto = $produto->tipo;
        }else{
            $tipoProduto = 'INSS';
        }

        switch($tipoProduto){
            case 'INSS' : {
                return $this->checkCreditByLeadINSS($lead,$uuid,$lp);
            }
            case 'FGTS' : {

                $lead = $this->criaOuAtualizaLead($CPF, (array)$lead);

                return $this->checkCreditByLeadFGTS($lead,$uuid);
            }
            default : {
                return response()->json(['status'=>'error','message'=>'Produto não encontrado.','data'=>'Erro', 'uuid' => $uuid,'idade'=>null,'CB'=>[],'redirect'=>false],200);
            }
        }

    }

    public function creditosINSS($uuid){

        $cpf = Beneficios::where('uuid','=',$uuid)->groupBy('beneficio')->first();

        $beneficios = Beneficios::where('cpf','=',$cpf->cpf)->where('situacao','LIKE','%ATIVO%')->groupBy('beneficio')->get();

        if(sizeof($beneficios) <= 0 ){
            return response()->json(['simulacoes'=>['erro'=>'Nenhum benefício encontrado.'],'uuid'=>$uuid]);
        }

        $bloqueados = Constants::BLOQUEADOS_INSS;
        $simulacoes = [];
        $lead = Lead::where('uuid','=',$uuid)->first();
        $valorSimulado = $lead->valor;

        $hoje = date('Y-m-d');
        $coeficiente = $this->getCoeficiente($hoje,Constants::QTDE_PARCELAS,Constants::BANCO);
        $valorCoeficiente = $coeficiente->data->coeficiente;

        if(!is_object($beneficios)){
            return response()->json(['simulacoes'=>['erro'=>'Nenhum benefício encontrado.'],'uuid'=>$uuid]);
        }

        $ids = Beneficios::selectRaw('GROUP_CONCAT(id) as ids')
            ->where('cpf','=',$cpf->cpf)
            ->where('situacao','LIKE','%ATIVO%')
            //->groupBy('beneficio')
            ->first();

        $explode = explode(',',$ids->ids);
        $ids_array = sizeof($explode) > 0 ? $explode : [$ids->ids];

        $checkValor = DB::table('inss_historico_margem AS M')
            ->selectRaw('SUM(M.margem_disponivel_emprestimo) as total_beneficios')
            //->where('tipo','=','online')
            ->whereIn('M.id_beneficio',$ids_array)
            ->orderByRaw("CASE WHEN M.tipo = 'online' THEN 1 ELSE 2 END")
            ->first();

        $valorDisponivel = $checkValor->total_beneficios;
        $valorDisponivelMaximo = (double)number_format($valorDisponivel/$valorCoeficiente,2,'.','');

        $esteira = new EsteiraPropostasController();

        foreach($beneficios as $beneficio){

            if(!in_array((int)$beneficio->especie,$bloqueados)){

                if(is_object($beneficio) && is_object($coeficiente)){
                    $simulacao = $esteira->simulacoes($beneficio->id,$hoje,$valorSimulado > $valorDisponivelMaximo ? $valorDisponivelMaximo : $valorSimulado,null);
                    $simulacoes[] = $simulacao->original;
                }

            }

        }

        return response()->json(['simulacoes'=>$simulacoes, 'margem'=>$valorDisponivel,'max_disponivel'=>$valorDisponivelMaximo, 'max_disponivel_format'=>number_format($valorDisponivelMaximo,2,',','.'),'uuid'=>$uuid,'valor_solicitado'=>number_format($valorSimulado,2,'.',''),'valor_solicitado_format'=>number_format(
        $valorSimulado,2,',','.')]);

    }

    public function creditosFGTS($uuid){

        $consultaCredito = ConsultaCredito::where('uuid','=',$uuid)->first();
        $parcelasDB = ParcelasFGTS::where('id_consulta_credito','=',$consultaCredito->id)->get();
        $parcelas = [];
        $lead = Lead::where('uuid','=',$uuid)->first();

        $valorDisponivel = 0.00;

        foreach($parcelasDB as $parcela){

            $valorDisponivel = $parcela->valor_cliente;

            $parc = [
                'valorDisponivel' => $parcela->valor_cliente,
                'qtdeParcelas' => $parcela->prazo,
                'valorParcela' => 0.00,
                'descricaoEspecie' => $parcela->descricao_tabela_financiamento,
                'consultaRealizadaEm' => date('Y-m-d'),
                'top' => 1,
                'mensagem' => 'LIMITE DE CRÉDITO DISPONÍVEL',
                'uuid' => $uuid
            ];

            $parcelas[] = $parc;

        }

        return response()->json(['parcelas'=>$parcelas,'uuid'=>$uuid,'valorDisponivel'=>$valorDisponivel]);

    }

    public function getCoeficiente($data,$qtde_parcela=84,$bancoId){

        try {

            $banco = Banco::findOrFail($bancoId);
            $tabela = Tabela::where('id_banco','=',$banco->id)->orderBy('id','DESC')->first();

            $coeficiente = DB::table('coeficiente')
                ->where('id_tabela','=',$tabela->id)
                ->where('data','=',$data)
                ->where('qtde_parcela','=',$qtde_parcela)
                ->where('status','=',1)
                ->first();

            if(is_object($coeficiente)){

                return (object)['status'=>'ok','message'=>'Coeficiente/Fator recuperado com sucesso.','data'=>$coeficiente];

            }else{

                $coeficiente['id'] = -1;
                $coeficiente['data'] = date('Y-m-d');
                $coeficiente['coeficiente'] = 0.0256;

                $message = 'Data '.$data.' parcelas '.$qtde_parcela.' código banco '.$banco->id;

                \Mail::to(['phelys@gmail.com','carrera@ccef.com.br'])->send(new ErrorCoeficiente($message));

                return (object)['status'=>'ok','message'=>'Coeficiente/Fator recuperado com sucesso.','data'=>(object)$coeficiente];

            }

        }catch (\Exception $e){
            $coeficiente['id'] = -1;
            $coeficiente['data'] = date('Y-m-d');
            $coeficiente['coeficiente'] = 0.0256;

            return (object)['status'=>'ok','message'=>'Coeficiente/Fator recuperado com sucesso.','data'=>(object)$coeficiente];
        }

    }

    public function etapaFinalINSS($uuid){

        try {

            $dados = DB::table('lead AS L')
                ->join('consulta_credito AS CC','L.uuid','=','CC.uuid')
                ->join('beneficios_cpf AS BC','CC.id','=','BC.cc_id')
                ->join('inss_dados_bancarios AS DB','BC.id','=','DB.id_beneficio')
                ->leftJoin('inss_historico_margem AS HM','BC.id','=','HM.id_beneficio')
                ->leftJoin('produto as P','L.produto','=','P.produto')
                ->selectRaw('L.*,BC.id as id_beneficio,BC.nome,BC.data_nascimento,BC.cpf,BC.especie,BC.descricao_especie,DB.id_cliente,DB.banco_nome,DB.agencia_codigo,HM.possui_representante_legal,DB.meio_pagamento_tipo')
                ->where('L.uuid','=',$uuid)
                ->first();

            if($dados->possui_representante_legal == true && $dados->meio_pagamento_tipo=='CONTA CORRENTE'){
                $dados->tipoDocs = 'conta-repres';
            }else if($dados->possui_representante_legal == false && $dados->meio_pagamento_tipo=='CONTA CORRENTE'){
                $dados->tipoDocs = 'conta-benef';
            }else if($dados->possui_representante_legal == true && $dados->meio_pagamento_tipo!='CONTA CORRENTE'){
                $dados->tipoDocs = 'cartao-repres';
            }else if($dados->possui_representante_legal == false && $dados->meio_pagamento_tipo!='CONTA CORRENTE'){
                $dados->tipoDocs = 'cartao-benef';
            }

            return response()->json(['status'=>'ok','message'=>'Dados carregados com sucesso.','uuid'=>$uuid,'dados'=>$dados],200);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage(),'uuid'=>$uuid],200);
        }

    }

    public function saveSimulacao(Request $request){

        $uuid = $request->uuid;
        $beneficiosSelecionados = json_decode($request->beneficiosSelecionados);
        $lead = Lead::where('uuid','=',$uuid)->first();

        try {

            $cpf = FunctionsController::onlyNumbers($lead->cpf);
            $cliente = Cliente::where('cpf','=',$cpf)->first();

            EsteiraProposta::create([
                'user_id' => 1,
                'id_produto' => 9,
                'id_cliente' => $cliente->id,
                'id_beneficio_cpf' => $beneficiosSelecionados->id_beneficio,
                'id_lead' => $lead->id,
                'data_abertura' => date('Y-m-d'),
                'valor' => $beneficiosSelecionados->margem_calculada,
                'id_coeficiente' => $beneficiosSelecionados->id_coeficiente,
                'parcelas' => $beneficiosSelecionados->qtde_parcela,
                'taxa' => $beneficiosSelecionados->coeficiente,
                'data_coeficiente' => $beneficiosSelecionados->data,
                'valor_margem' => $beneficiosSelecionados->margem_total_disponivel,
                'valor_parcela' => $beneficiosSelecionados->valor_parcela
            ]);

            return response()->json(['status'=>'ok','message'=>'Pré-proposta salva com sucesso.','uuid'=>$uuid],200);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage(),'uuid'=>$uuid,'line'=>$e->getLine()],200);
        }

    }

    public function saveFinish(Request $request){

        try {

            $data = [
                'rg' => $request->rg,
                'orgao_emissor' => $request->orgao_emissor,
                'nacionalidade' => $request->nacionalidade,
                'genero' => $request->genero,
                'logradouro' => $request->logradouro,
                'numero' => $request->numero,
                'complemento' => $request->complemento,
                'bairro' => $request->bairro,
                'cidade' => $request->cidade,
                'cep' => $request->cep,
                'estado' => $request->uf,
                'email' => isset($request->email) ? $request->email : null,
                'celular' => isset($request->celular) ? $request->celular : null,
                'status' => 1,
            ];

            Cliente::where('id','=',$request->id_cliente)->update($data);

//            if(isset($request->email)){
//                \Mail::to(['phelys@gmail.com', 'carrera@ccef.com.br', $request->email])->send(new DocumentosMail($data));
//            }else{
//                \Mail::to(['phelys@gmail.com', 'carrera@ccef.com.br'])->send(new DocumentosMail($data));
//            }
//
//            $message = "Olá $request->nome, tudo bem? Estamos quase finalizando o processo, pode enviar para nós, aqui no WhatsApp mesmo, os seguintes documentos: Self, foto do RG, foto do CPF ou CNH e do cartão que irá receber o benefício.";
//
//            $wa = new WhatsAppController();
//            $wa->sendMessage('55'.FunctionsController::onlyNumbers($request->celular),$message);

            return response()->json(['status'=>'ok','message'=>'Contratação on-line finalizada com sucesso.'],200);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()],200);
        }

    }

}
