<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\FunctionsController;
use App\Models\Beneficios;
use App\Models\Cliente;
use App\Models\EsteiraProposta;
use App\Models\Lead;
use App\Models\MotivoBloqueio;
use App\Models\SimulacoesDisponiveis;
use App\Models\SimulacoesRealizadas;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class EsteiraPropostasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function simulacoesRealizads($id_beneficio){

        $simulacoes = DB::table('simulacoes_realizadas AS SR')
            ->leftJoin('tabela AS T','SR.id_tabela','=','T.id')
            ->selectRaw('SR.*, T.nome')
            ->where('id_beneficio','=',$id_beneficio)
            ->get();

        return response()->json(['data'=>$simulacoes],200);

    }

    public function motivosBloqueios($id_beneficio){

        $motivos = DB::table('motivo_bloqueio AS MB')
            ->join('tabela AS T','MB.id_tabela','=','T.id')
            ->selectRaw('MB.*, T.nome')
            ->where('id_beneficio','=',$id_beneficio)
            ->get();

        return response()->json(['data'=>$motivos],200);

    }

    public function reprocessarSimulacoes($id_beneficio){

        $autonomous = new AutonomousController();

        $beneficio = DB::table('beneficios_cpf AS BC')
            ->selectRaw('BC.id as id_beneficio, BC.beneficio, BC.cpf, BC.uuid')
            ->where('BC.id','=',$id_beneficio)
            ->first();

        $add = SimulacoesDisponiveis::updateOrCreate([
            'beneficio' => $beneficio->beneficio,
            'cpf' => $beneficio->cpf,
        ],[
            'id_beneficio' => $beneficio->id_beneficio,
            'beneficio' => $beneficio->beneficio,
            'cpf' => $beneficio->cpf,
            'credito_margem' => $autonomous->checkMargemCredito($beneficio->id_beneficio),
            'credito_refin_portabilidade' => $autonomous->checkRefinanciamentoCredito($beneficio->id_beneficio) + $autonomous->checkPortabilidadeCredito($beneficio->id_beneficio),
        ]);

        return $add ? response()->json(['data'=>$add],200) : response()->json(['data'=>'Erro ao reprocessar as simulações'],400);

    }

    public function reprocessarBeneficios($cpf){

        $cpfOnly = FunctionsController::onlyNumbers($cpf);
        $check = Lead::where('cpf','=',$cpfOnly)->orWhere('cpf','=',$cpf)->first();

        if(is_object($check)){
            $reprocess = new DataConsigV2Controller($cpfOnly,1,$check->id);
            $reprocess = $reprocess->getBeneficiosByCPF(6,$check->uuid,1);

            $json = json_decode($reprocess);

            if($json->status == 'ok'){
                $p = new AutonomousController();
                if($p->doCheckContratos()){
                    $p->doSimulacaoAll();

                    return $reprocess;
                }
            }

        }

    }

    public function changeStatus(Request $request){

        try {

            $change = EsteiraProposta::where('id','=',$request->id_esteira)->update(['status'=>$request->id_status]);

            return response()->json(['id_esteira'=>$request->id_esteira]);

        }catch (\Exception $e){

        }

    }

    public function index(Request $request)
    {

        $key = isset($request->key) ? $request->key : null;
        $startDate = isset($request->startDate) ? Carbon::parse($request->startDate)->startOfDay()->format('Y-m-d H:i:s') : Carbon::now()->subDays(3)->startOfDay()->format('Y-m-d H:i:s');
        $endDate = isset($request->endDate) ? Carbon::parse($request->endDate)->endOfDay()->format('Y-m-d H:i:s') : Carbon::now()->endOfDay()->format('Y-m-d H:i:s');
        $status = isset($request->status) ? $request->status : 1;

        try {

            $data = DB::table('esteira_propostas as E')
                ->join('cliente AS C','E.id_cliente','=','C.id')
                ->join('users AS U','E.user_id','=','U.id')
                ->join('lead AS L','E.id_lead','=','L.id')
                ->join('beneficios_cpf AS BC','E.id_beneficio_cpf','=','BC.id')
                ->join('rotinas AS R','E.status','=','R.id')
                ->leftJoin('inss_dados_bancarios AS INSSBanco','INSSBanco.id_beneficio','=','E.id_beneficio_cpf')
                ->selectRaw('E.*, C.nome, C.cpf, C.data_nascimento, U.name as colaborador, L.celular, L.email, L.valor as valor_solicitado, L.produto as produto_simulado, E.valor_margem as valor_margem, E.valor_liberado, E.coeficiente, E.valor_parcela, E.parcelas, FLOOR(DATEDIFF(CURDATE(), C.data_nascimento) / 365) as idade, BC.descricao_especie, BC.especie, BC.beneficio, BC.id as id_beneficio, INSSBanco.banco_nome')
                ->whereBetween('E.created_at',[$startDate,$endDate])
                ->where('R.digitacao','=',0)
                ->when(!is_null($key),function($query) use ($key){
                    $query->where('B.nome','LIKE','%'.$key.'%')
                        ->orWhere('B.cpf','LIKE','%'.$key.'%');
                })
                ->when($status > 0,function($query) use ($status){
                    $query->where('E.status','=',$status);
                });

            $sql = $data->toSql();
            $params = $data->getBindings();

            $data = $data->paginate(20);

            return response()->json(['data'=>$data,'status'=>'ok','sql'=>$sql,'params'=>$params], 200);

        }catch (\Exception $e){

            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);

        }
    }

    public function digitacao(Request $request)
    {

        $key = isset($request->key) ? $request->key : null;
        $startDate = isset($request->startDate) ? Carbon::parse($request->startDate)->startOfDay()->format('Y-m-d H:i:s') : Carbon::now()->subDays(3)->startOfDay()->format('Y-m-d H:i:s');
        $endDate = isset($request->endDate) ? Carbon::parse($request->endDate)->endOfDay()->format('Y-m-d H:i:s') : Carbon::now()->endOfDay()->format('Y-m-d H:i:s');
        $status = isset($request->status) ? $request->status : 1;

        try {

            $data = DB::table('esteira_propostas as E')
                ->join('cliente AS C','E.id_cliente','=','C.id')
                ->join('users AS U','E.user_id','=','U.id')
                ->join('lead AS L','E.id_lead','=','L.id')
                ->join('beneficios_cpf AS BC','E.id_beneficio_cpf','=','BC.id')
                ->join('rotinas AS R','E.status','=','R.id')
                ->leftJoin('inss_dados_bancarios AS INSSBanco','INSSBanco.id_beneficio','=','E.id_beneficio_cpf')
                ->selectRaw('E.*, C.nome, C.cpf, C.data_nascimento, U.name as colaborador, L.celular, L.email, L.valor as valor_solicitado, L.produto as produto_simulado, E.valor as valor_beneficio, FLOOR(DATEDIFF(CURDATE(), C.data_nascimento) / 365) as idade, BC.descricao_especie, BC.especie, BC.beneficio, BC.id as id_beneficio, INSSBanco.banco_nome')
                ->whereBetween('E.created_at',[$startDate,$endDate])
                ->where('R.digitacao','=',1)
                ->when(!is_null($key),function($query) use ($key){
                    $query->where('B.nome','LIKE','%'.$key.'%')
                        ->orWhere('B.cpf','LIKE','%'.$key.'%');
                });

            $sql = $data->toSql();
            $params = $data->getBindings();

            $data = $data->paginate(20);

            return response()->json(['data'=>$data,'status'=>'ok','sql'=>$sql,'params'=>$params], 200);

        }catch (\Exception $e){

            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);

        }
    }

    public function coeficientesByTabela($id_tabela,$data,$prazo_min=0,$prazo_max=84,$valor=500.00,$margem_disponivel=0.00,$valor_parcela_simulado=0){

        $coeficientes = DB::table('coeficiente AS C')
            ->join('tabela AS T','C.id_tabela','=','T.id')
            ->selectRaw('C.id as id_coeficiente,C.coeficiente,C.qtde_parcela, C.data, C.id_tabela, T.id_banco')
            ->where('C.data','=',$data)
            ->where('C.qtde_parcela','>',0)
            ->where('C.id_tabela','=',$id_tabela)
            ->where('T.status','=',1)
            ->whereBetween('C.qtde_parcela',[$prazo_min,$prazo_max])
            ->orderBy('C.id_tabela')
            ->orderBy('C.qtde_parcela','DESC')
            ->get();

        $default = 0.0268500;

        $coeficientesCalc = [];
        if(sizeof($coeficientes) > 0 && ($margem_disponivel/$default) > 700.00){

            foreach($coeficientes as $coeficiente){

                if($valor_parcela_simulado>0){
                    $valor_parcela = $valor_parcela_simulado;
                    $valor_total_pagar = number_format($valor_parcela*$coeficiente->qtde_parcela,2,'.','');
                    $margem_total_disponivel = number_format($valor_parcela_simulado/$coeficiente->coeficiente,2,'.','');

                    $perc_juros_total = abs(1-($margem_total_disponivel/$valor_total_pagar))*100;

                    $comissao = $this->getComissao($coeficiente->id_banco,$coeficiente->id_tabela,$coeficiente->qtde_parcela,$margem_total_disponivel);

                }else{
                    $valor_parcela = number_format($valor*$coeficiente->coeficiente,2,'.','');
                    $valor_total_pagar = number_format($valor_parcela*$coeficiente->qtde_parcela,2,'.','');
                    $margem_total_disponivel = $valor;

                    $perc_juros_total = $margem_total_disponivel > 0.00 && $valor_total_pagar > 0.00 ? abs(1-($margem_total_disponivel/$valor_total_pagar))*100 : 0.00;

                    $comissao = $this->getComissao($coeficiente->id_banco,$coeficiente->id_tabela,$coeficiente->qtde_parcela,$margem_total_disponivel);

                }

                if($margem_disponivel >= $valor_parcela && $comissao > 0){

                    $margem_calculada = $margem_disponivel > 0.00 ? $margem_disponivel/$coeficiente->coeficiente : 0.00;

                    $coeficientesCalc[] = [
                        'id_tabela'=>$coeficiente->id_tabela,
                        'id_coeficiente'=>$coeficiente->id_coeficiente,
                        'coeficiente'=>$coeficiente->coeficiente,
                        'qtde_parcela'=>$coeficiente->qtde_parcela,
                        'data'=>$data,
                        'valor_parcela'=>$valor_parcela,
                        'valor_total_pagar'=>$valor_total_pagar,
                        'margem_total_disponivel' => $margem_total_disponivel,
                        'comissao'=>$comissao,
                        'perc_juros_total'=>number_format($perc_juros_total,2,'.',''),
                        'margem_calculada'=>(float)number_format($margem_calculada,2,'.',''),
                        'margem_calculada_format'=>number_format($margem_calculada,2,',','.'),
                    ];
                }

            }

            return $coeficientesCalc;
        }else{
            return ['coeficiente'=>0.00,'qtde_parcela'=>0,'data'=>$data,'valor_parcela'=>0.00];
        }

    }

    public function checkRegrarSimulacao(Request $request){

        $parametros = [
            'id_tabela' => $request->id_tabela,
            'idade' => $request->idade,
            'valor' => $request->valor,
            'especie' => $request->especie,
            'data_dib' => $request->data_dib,
            'uf' => $request->uf,
            'alfabetizado' => $request->alfabetizado,
            'representante_legal' => $request->representante_legal,
            'ordem_pagamento' => $request->ordem_pagamento,
            'parcelas_emaberto' => $request->parcelas_emaberto,
            'total_parcelas' => $request->total_parcelas
        ];

        return $this->checkBloqueioByTabela($parametros);

    }

    public function substituteBindings($sql, $bindings) {
        foreach ($bindings as $binding) {
            $value = is_numeric($binding) ? $binding : "'" . addslashes($binding) . "'";
            $sql = preg_replace('/\?/', $value, $sql, 1);
        }
        return $sql;
    }

    public function checkBloqueioByTabela($parametros){

        $id_tabela = $parametros['id_tabela'] > 0 ? $parametros['id_tabela'] : 0;
        $idade = (int)$parametros['idade'] > 0 ? $parametros['idade'] : 99;
        $valor = $parametros['valor'] > 0 ? $parametros['valor'] : 0.00;
        $especie = (int)$parametros['especie'] > 0 ? $parametros['especie'] : 0;
        $dataDIB = $parametros['data_dib'] != '' ? $parametros['data_dib'] : null;
        $uf = !is_null($parametros['uf']) ? $parametros['uf'] : '';
        $alfabetizado = $parametros['alfabetizado'] ? true : false;
        $representante_legal = $parametros['representante_legal'] ? true : false;
        $ordem_pagamento = $parametros['ordem_pagamento'] ? true : false;
        $parcelas_emaberto = $parametros['parcelas_emaberto'];
        $total_parcelas =  $parametros['total_parcelas'];

        $idade = (int)$idade;
        $especie = (int)$especie;
        $block = false;
        $blockBy = [];
        $blockByLabel = [];
        $prazo_min = 0;
        $prazo_max = 84;
        $especies_bloqueadas = [];
        $especies_permitidas = [];

        try {

            $check_generica = DB::table('regras_negocio_tabela AS RNT')
                ->join('regras_negocio as RN','RNT.id_regra_negocio','=','RN.id')
                ->selectRaw('RNT.*, RN.tipo, RN.regra, RN.bloqueado')
                ->where('RNT.id_regra_negocio','=',34)
                ->where('RNT.id_tabela','=',$id_tabela)
                ->get();

            if(sizeof($check_generica) > 0){//OK

                $check_idade_valor = DB::table('regras_negocio_tabela AS RNT')
                    ->join('regras_negocio as RN','RNT.id_regra_negocio','=','RN.id')
                    ->selectRaw('RNT.*, RN.tipo, RN.regra, RN.bloqueado')
                    ->when($idade > 0,function($query) use ($idade){
                        $query->whereRaw('RNT.idade_de <= ? AND RNT.idade_ate >= ?',[$idade,$idade]);
                    })
                    ->when($valor > 0,function($query) use ($valor){
                        $query->whereRaw('RNT.valor_de <= ? AND RNT.valor_ate >= ?',[$valor,$valor]);
                    })
                    ->where('RNT.especies_permitidas','LIKE','%'.$especie.'%')
                    ->whereRaw('RNT.id_regra_negocio = ?', [34])
                    ->whereRaw('RNT.id_tabela = ?',[$id_tabela])
                    ->get();

                if(sizeof($check_idade_valor) <= 0){
                    $block = true;
                    $blockBy[] = 34;
                    $blockByLabel[] = 'Genérica idade e/ou valor';
                }
            }

            $checks = DB::table('regras_negocio_tabela AS RNT')
                ->join('regras_negocio as RN','RNT.id_regra_negocio','=','RN.id')
                ->selectRaw('RNT.*, RN.tipo, RN.regra, RN.bloqueado')
                ->when($idade > 0,function($query) use ($idade){
                    $query->whereRaw('RNT.idade_de <= ? AND RNT.idade_ate >= ?',[$idade,$idade]);
                })
                ->when($valor > 0,function($query) use ($valor){
                    $query->whereRaw('RNT.valor_de <= ? AND RNT.valor_ate >= ?',[$valor,$valor]);
                })
                ->whereRaw('RNT.id_regra_negocio = ?', [34])
                ->whereRaw('RNT.id_tabela = ?',[$id_tabela])
                ->get();

            if(sizeof($checks) > 0){//OK
                foreach ($checks as $check){
                    $especies_bloqueadas = explode(",",preg_replace('/[^0-9,]/', '', $check->especies_bloqueadas));
                    $especies_permitidas = explode(",",preg_replace('/[^0-9,]/', '', $check->especies_permitidas));

                    if(in_array($especie,$especies_bloqueadas) || !in_array($especie,$especies_permitidas)){
                        $block = true;
                        $blockBy[] = $check->id_regra_negocio;
                        $blockByLabel[] = 'Genérica espécie'.$check->regra;
                    }else{
                        $prazo_min = $check->prazo_de;
                        $prazo_max = $check->prazo_ate;
                    }

                }
            }

            $regras = DB::table('regras_negocio_tabela AS RNT')
                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                ->selectRaw('RNT.*, R.tipo')
                ->where('id_tabela','=',$id_tabela)
                ->where('id_regra_negocio','<>',34)
                ->get();

            foreach($regras as $regra){

                switch((int)$regra->id_regra_negocio){

                    case 4 : {

                        if($alfabetizado===false) {//OK

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela', '=', $regra->id_tabela)
                                ->where('RNT.valor', '=', 1)
                                ->where('R.bloqueado', '=', 1)
                                ->where('RNT.id_regra_negocio', '=', 4);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 4;
                                $blockByLabel[] = 'Bloquear Analfabeto';
                            }

                        }
                        break;

                    }

                    case 5 : {

                        if(!is_null($dataDIB)){

                            $dataDIBC = Carbon::createFromFormat('Y-m-d',$dataDIB)->format('Y-m-d');

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.id_regra_negocio', '=', 5)
                                ->whereRaw("STR_TO_DATE(RNT.valor, '%d/%m/%Y') > ? ",[$dataDIBC]);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 5;
                                $blockByLabel[] = 'Bloquear DIB anterior data';
                            }

                        }
                        break;

                    }

                    case 6 : {

                        if(!is_null($dataDIB)){

                            $dataDIBC = Carbon::createFromFormat('Y-m-d',$dataDIB)->format('Y-m-d');

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.id_regra_negocio', '=', 6)
                                ->whereRaw("STR_TO_DATE(RNT.valor, '%d/%m/%Y') < ? ",[$dataDIBC]);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 6;
                                $blockByLabel[] = 'Bloquear DIB após data';
                            }

                        }
                        break;

                    }

                    case 7 : {

                        if($ordem_pagamento) {

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela', '=', $regra->id_tabela)
                                ->where('RNT.valor', '=', 1)
                                ->where('R.bloqueado', '=', 1)
                                ->where('RNT.id_regra_negocio', '=', 7);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 7;
                                $blockByLabel[] = 'Bloquear Ordem Pagamento';
                            }

                        }
                        break;

                    }

                    case 10 : {

                        if(isset($uf)) {

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela', '=', $regra->id_tabela)
                                ->where('RNT.valor', 'LIKE', '%'.$uf.'%')
                                ->where('RNT.id_regra_negocio', '=', 10);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 10;
                                $blockByLabel[] = 'UF Bloqueada';
                            }

                        }
                        break;

                    }

                    case 11 : {

                        if(is_numeric($idade)){

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.valor','>',$idade)//exemplo idade mínima 20 e vem 15
                                ->where('RNT.id_regra_negocio', '=', 11);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 11;
                                $blockByLabel[] = 'Idade mínima não atendida.';
                            }

                        }
                        break;

                    }

                    case 12 : {

                        if($idade > 0){

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.valor','<',$idade)//exemplo 60 e vem 70
                                ->where('RNT.id_regra_negocio', '=', 12);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 12;
                                $blockByLabel[] = 'Idade Maxima';
                            }

                        }
                        break;

                    }

                    case 23 : { //tempo mínimo DIB

                        if(!is_null($dataDIB)) {

                            $date = Carbon::createFromFormat('Y-m-d',$dataDIB);
                            $now = Carbon::now();

                            $mesesPassados = $date->diffInMonths($now);

                            $check = DB::table('regras_negocio_tabela AS RNT')
                                ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela', '=', $regra->id_tabela)
                                ->where('RNT.id_regra_negocio', '=', 23)
                                ->whereRaw("RNT.valor > ? ",[$mesesPassados]);//AND FIND_IN_SET(?, especies_bloqueadas)

                            if ($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 23;
                                $blockByLabel[] = 'Tempo Minimo DIB';
                            }

                        }
                        break;

                    }

                    case 33 : {

                        $check = DB::table('regras_negocio_tabela AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->whereIn('RNT.valor', [1,'Sim'])
                            ->where('R.bloqueado', '=', 1)
                            ->where('RNT.id_regra_negocio', '=', 33);

                        if($check->count() > 0 && in_array($representante_legal,[1,'Sim'])) {
                            $block = true;
                            $blockBy[] = 33;
                            $blockByLabel[] = 'Bloqueia Representante Legal';
                        }

                        break;

                    }

                    default : {
                        $block = true;
                        $blockBy[] = 99;
                        $blockByLabel[] = 'Default '.(int)$regra->id_regra_negocio;
                        break;
                    }

                }

            }

            return ['status'=>'ok','data'=>['block'=>$block,'blockBy'=>array_unique($blockBy),'blockByLabel'=>array_unique($blockByLabel),'especies_permitidas'=>$especies_permitidas, 'prazo_min'=>$prazo_min,'prazo_max'=>$prazo_max],'message'=>'Validação efetuada com sucesso.'];


        }catch (\Exception $e){
            \Log::critical('Erro ao verificar os bloqueios -> '.$e->getMessage().' na linha '.$e->getLine());
            return ['status'=>'error', 'data'=>[], 'message'=>'Erro ao verificar os bloqueios -> '.$e->getMessage().' na linha '.$e->getLine()];
        }


    }

    public function getIdsTabelasComCoeficiente($data){

        $tabelas_coeficientesDB = DB::table('coeficiente')->selectRaw('id_tabela')->where('data','=',$data)->get();
        $tabelas_coeficientes = [];

        foreach ($tabelas_coeficientesDB as $tabelas) {
            $tabelas_coeficientes[] = $tabelas->id_tabela;
        }

        $tabelas_coeficientes = array_values(array_unique($tabelas_coeficientes));

        return $tabelas_coeficientes;
    }

    public function checkTemRegras($id_tabela){
        return DB::table('regras_negocio_tabela')->where('id_tabela','=',$id_tabela)->count() > 0 ? true : false;
    }

    public function simulacoes($id_beneficio,$data,$valor=0.00,$valor_parcela=null){

        try {

            $iteracoes = 0;
            $tabelas_bloqueadas = [];
            $validacoes = [];

            $margem = DB::table('inss_historico_margem AS BM')
                ->join('beneficios_cpf AS B','BM.id_beneficio','=','B.id')
                ->where('BM.id_beneficio','=',$id_beneficio)
                ->orderByRaw("CASE WHEN BM.tipo = 'online' THEN 1 ELSE 2 END")
                ->first();

            if(is_object($margem)){

                $dados_bancarios = DB::table('inss_dados_bancarios')
                    ->where('id_beneficio','=',$id_beneficio)
                    ->first();

                $dados_historico = DB::table('inss_historico_contratos_emprestimo')
                    ->where('id_beneficio','=',$id_beneficio)
                    ->first();

                $ordem_pagamento = 1;
                if(is_object($dados_bancarios)){
                    $meio_pagamento_tipo = $dados_bancarios->meio_pagamento_tipo;
                    if($meio_pagamento_tipo=='CONTA CORRENTE'){
                        $ordem_pagamento = 0;
                    }else{
                        $ordem_pagamento = 1;
                    }
                }

                $cliente = DB::table('cliente')
                    ->where('id','=',$margem->id_cliente)
                    ->first();

                if(!is_object($cliente) || is_null($cliente)){
                    $add = Cliente::updateOrCreate([
                        'id'=>$margem->id_cliente,
                    ],[
                        'id'=>$margem->id_cliente,
                        'nome'=>$margem->nome,
                        'cpf'=>$margem->cpf,
                        'data_nascimento'=>$margem->data_nascimento,
                        'estado'=>$margem->uf
                    ]);
                }

                $dateOfBirth = Carbon::parse($cliente->data_nascimento);
                $now = Carbon::now();

                $alfabetizado = $cliente->alfabetizado;
                $tem_representante_legal = $margem->possui_representante_legal;
                $idade = $dateOfBirth->diffInYears($now);
                $margem_disponivel = (float)$margem->margem_disponivel_emprestimo;
                $especie = (int)$margem->especie;
                $descricao_especie = (int)$margem->descricao_especie;
                $data_dib = $margem->dib;
                $uf = $margem->uf;
                if(is_object($dados_historico)) {
                    $parcelas_emaberto = $dados_historico->quantidade_parcelas_emaberto;
                    $total_parcelas = $dados_historico->quantidade_parcelas;
                }else{
                    $parcelas_emaberto = null;
                    $total_parcelas = null;
                }

                $com_coeficiente = $this->getIdsTabelasComCoeficiente($data);

                $tabelas = DB::table('tabela AS T')
                    ->join('banco AS B','B.id','=','T.id_banco')
                    ->selectRaw('T.*, B.nome_banco')
                    ->where('T.status','=',1)
                    ->whereIn('T.id',$com_coeficiente)
                    ->get();

                $simulacoes = [];

                foreach ($tabelas as $tabela){

                    $check_regras = $this->checkTemRegras($tabela->id);
                    $coeficientes = [];

                    $coeficiente = 0.0268500;///

                    $parametros = [
                        'id_tabela'=> $tabela->id,
                        'idade'=>$idade,
                        'margem_disponivel'=>$margem_disponivel,
                        'coeficiente'=>$coeficiente,
                        'margem_calculada'=>(float)number_format($margem_disponivel/$coeficiente,2,'.',''),
                        'especie'=>$especie,
                        'data_dib'=>$data_dib,
                        'uf'=>$uf,
                        'alfabetizado'=>$alfabetizado,
                        'representante_legal'=>$tem_representante_legal,
                        'ordem_pagamento'=>$ordem_pagamento,
                        'valor'=>$valor == 0.00 || is_null($valor) ? (float)number_format($valor_parcela/$coeficiente,2,'.',''): (float)$valor,
                        'parcelas_emaberto'=>$parcelas_emaberto,
                        'total_parcelas'=>$total_parcelas,
                    ];

                    if($check_regras){

                        $validacao = $this->checkBloqueioByTabela($parametros);
                        $validacoes[] = $validacao;

                        if($validacao['status']=='ok'){
                            $bloqueado = $validacao['data']['block'];

                            if(!$bloqueado){

                                $prazo_min = $validacao['data']['prazo_min'];
                                $prazo_max = $validacao['data']['prazo_max'];

                                $coeficientes = $this->coeficientesByTabela($tabela->id,$data,$prazo_min,$prazo_max,$valor,$margem_disponivel,$valor_parcela);

                                if(isset($coeficientes[0]['coeficiente']) && $coeficientes[0]['coeficiente'] > 0) {
                                    $simulacoes[] = ['id_tabela' => $tabela->id, 'label' => $tabela->nome, 'coeficientes' => $coeficientes, 'id_banco'=>$tabela->id_banco, 'nome_banco'=>$tabela->nome_banco,'descricao_especie'=>$margem->descricao_especie,'id_beneficio'=>$id_beneficio];
                                }

                                SimulacoesRealizadas::updateOrCreate(
                                    [
                                        'id_beneficio' => $id_beneficio,
                                        'id_tabela' => $tabela->id,
                                    ],
                                    [
                                        'id_beneficio' => $id_beneficio,
                                        'id_tabela' => $tabela->id,
                                        'params' => json_encode($parametros),
                                        'validacao' => json_encode($validacao),
                                        'simulacoes'=> json_encode($simulacoes)
                                    ]
                                );

                            }else{

                                //salva motivo bloqueio
                                MotivoBloqueio::updateOrCreate(
                                    [
                                        'id_beneficio' => $id_beneficio,
                                        'id_tabela' => $tabela->id,
                                    ],
                                    [
                                        'id_beneficio' => $id_beneficio,
                                        'valor' => $valor,
                                        'id_tabela' => $tabela->id,
                                        'motivo' => json_encode($validacao['data']),
                                        'params' => json_encode($parametros)
                                    ]
                                );

                                $tabelas_bloqueadas[] = ['id_tabela'=>$tabela->id,'block'=>$validacao['data']['block'],'blockByRegras'=>$validacao['data']['blockBy'],'blockByRegrasLabel'=>$validacao['data']['blockByLabel']];
                            }
                        }

                    }

                    unset($coeficientes);
                    $iteracoes++;

                }

                usort($simulacoes, function($a, $b) {
                    $valorTotalA = floatval($a['coeficientes'][0]['comissao']);
                    $valorTotalB = floatval($b['coeficientes'][0]['comissao']);

                    if ($valorTotalA == $valorTotalB) {
                        return 0;
                    }
                    return ($valorTotalA < $valorTotalB) ? 1 : -1;
                });

                $return = [
                    'status'=>'ok',
                    'simulacoes'=>$simulacoes,
                    'message'=>'Simulações calculadas para a data.',
                    'tabelas_bloqueadas'=>$tabelas_bloqueadas,
                    'parametros'=>$parametros,
                    'iteracoes'=>$iteracoes,
                    'validacoes'=>$validacoes
                ];

                return response()->json($return,200);

            }else{
                \Log::critical('Margem não encontrada para o benefício '.$id_beneficio);
                return response()->json(['status'=>'error','simulacoes'=>[],'message'=>'Margem não encontrada.'],200);
            }

        }catch (\Exception $e){
            \Log::critical($e->getMessage());
            return response()->json(['status'=>'error','simulacoes'=>[],'message'=>$e->getMessage(),'line'=>$e->getLine()],200);
        }

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function getComissao($id_banco,$id_tabela,$prazo,$valor_emprestimo){

        $comissao = DB::table('comissoes AS C')
            ->selectRaw('C.percent_comissao')
            ->where('C.id_banco','=',$id_banco)
            ->where('C.id_tabela','=',$id_tabela)
            ->where('C.parcelas_inicio','<=',$prazo)
            ->where('C.parcelas_fim','>=',$prazo)
            ->first();

        if(is_object($comissao)) {
            return $valor_emprestimo * ($comissao->percent_comissao / 100);
        }else{
            return 0.00;
        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        try {

            $user = $request->user();

            $id_beneficio = $request->id_beneficio;
            $id_banco = $request->id_banco;
            $id_tabela = $request->id_tabela;
            $id_coeficiente = $request->id_coeficiente;
            $qtde_parcelas = $request->qtde_parcelas;
            $coeficiente = $request->coeficiente;
            $valor_margem = $request->valor_margem;
            $valor_parcela = $request->valor_parcela;
            $credito = $request->credito;
            $valor_comissao = $request->valor_comissao;
            $data_coeficiente = $request->data_coeficiente;

            //calculados
            $valor_total_com_juros = $request->valor_parcela * $request->qtde_parcelas;
            $valor_liberado = $credito;

            $beneficio = DB::table('beneficios_cpf AS B')
                ->leftJoin('consulta_credito as CC','B.cc_id','=','CC.id')
                ->leftJoin('lead as L','CC.lead_id','=','L.id')
                ->leftJoin('cliente as C','C.id_lead','=','CC.lead_id')
                ->selectRaw('B.cpf,C.id as id_cliente,CC.lead_id')
                ->where('B.id','=',$id_beneficio)
                ->first();

            $add = EsteiraProposta::updateOrCreate(
                [
                    'id_beneficio_cpf'=>$id_beneficio
                ],
                [
                    'user_id'=>$user->id,
                    'id_beneficio_cpf'=>$id_beneficio,
                    'id_banco'=>$id_banco,
                    'id_tabela'=>$id_tabela,
                    'id_cliente'=>$beneficio->id_cliente,
                    'id_coeficiente'=>$id_coeficiente,
                    'id_lead' => $beneficio->lead_id,
                    'coeficiente' => $coeficiente,
                    'qtde_parcelas' => $qtde_parcelas,
                    'valor_margem' => $valor_margem,
                    'valor_total_com_juros' => $valor_total_com_juros,
                    'valor_liberado' => $valor_liberado,
                    'valor_comissao' => $valor_comissao,
                    'valor_parcela' => $valor_parcela,
                    'data_abertura' => date('Y-m-d H:i:s'),
                    'parcelas' => $qtde_parcelas,
                    'data_coeficiente'=>$data_coeficiente
                ]
            );

            return response()->json(['status'=>'ok'],200);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','error'=>$e->getMessage()],400);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        try {

            $ficha = DB::table('esteira_propostas as E')
                ->join('cliente AS C','E.id_cliente','=','C.id')
                ->selectRaw('E.*, C.nome, C.cpf, C.data_nascimento, C.logradouro, C.numero, C.complemento, C.bairro, C.cidade, C.cep, C.estado, C.genero, C.obito')
                ->where('E.id','=',$id)
                ->first();

            return response()->json($ficha, 200);

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage(),'status'=>'error'], 400);
        }

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function beneficiosByCPF($cpf){

        try{

            $cpf = FunctionsController::onlyNumbers($cpf);

            $beneficios = Beneficios::where('cpf','=',$cpf)->get();

            return response()->json(['data'=>$beneficios], 200);

        }catch (\Exception $e){
            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);
        }

    }

    public function saveApprove(Request $request){

        try {

            $id = $request->id;

            $up = EsteiraProposta::where('id','=',$id)->update(['status'=>2]);

            return response()->json(['status'=>'ok'],200);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','error'=>$e->getMessage()],400);
        }

    }

    public function saveDigitacao(Request $request){



    }

}
