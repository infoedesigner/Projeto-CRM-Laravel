<?php

namespace App\Http\Controllers\API;

use App\Models\Banco;
use App\Models\Cliente;
use App\Models\INSSHistoryContratosEmprestimo;
use App\Models\Portabilidade;
use App\Models\RegrasNegocioTabela;
use App\Models\RegrasNegocioTabelaPortabilidade;
use App\Models\Tabela;
use Carbon\Carbon;
use DB;
use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PortabilidadeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        try {

            $term = isset($request->key) ? $request->key : null;

            $all = DB::table('portabilidade AS P')
                ->leftJoin('banco AS B','P.id_banco','=','B.id')
                ->selectRaw('P.*, B.nome_banco')
                ->when(!is_null($term),function($q) use ($term){
                    $q->where('P.nome_tabela','LIKE','%'.$term.'%');
                    $q->orWhere('P.id','=',(int)$term);
                })
                ->get();

            return response()->json($all,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function contratos($id_beneficio,$tipo){

        $contratos = DB::table('inss_historico_contratos_emprestimo AS IHCE')
            ->where('id_beneficio','=',$id_beneficio)
            ->where('situacao','=','Ativo')
            ->where('valor_emprestado','>',0.00)
            ->whereRaw('valor_emprestado > saldo_quitacao')
            ->groupBy('contrato')
            ->get();

        $tabelas = DB::table('portabilidade')->where('tipo','=',$tipo)->where('status','=',1)->get();

        $recontratos = [];

        $i = 0;
        foreach($contratos as $contrato){
            $recontratos[$i]['contrato'] = $contrato->contrato;
            $recontratos[$i]['banco_nome'] = $contrato->banco_nome;
            $recontratos[$i]['tipo_emprestimo_descricao'] = $contrato->tipo_emprestimo_descricao;
            $recontratos[$i]['banco_codigo'] = $contrato->banco_codigo;
            $recontratos[$i]['data_inicio_contrato'] = $contrato->data_inicio_contrato;
            $recontratos[$i]['data_inclusao'] = $contrato->data_inclusao;
            $recontratos[$i]['valor_emprestado'] = $contrato->valor_emprestado;
            $recontratos[$i]['valor_parcela'] = $contrato->valor_parcela;
            $recontratos[$i]['quantidade_parcelas'] = $contrato->quantidade_parcelas;
            $recontratos[$i]['quantidade_parcelas_emaberto'] = $contrato->quantidade_parcelas_emaberto;
            $recontratos[$i]['saldo_quitacao'] = $contrato->saldo_quitacao;
            $recontratos[$i]['taxa'] = $contrato->taxa;
            $recontratos[$i]['valor_emprestado'] = $contrato->valor_emprestado;

            foreach($tabelas as $tabela){
                $recontratos[$i]['tabelas'][] = $this->simulacoes($id_beneficio,$contrato->id,$tabela->id,$tipo);
            }

            $recontratos[$i]['qtdeVerde'] = array_key_exists("simulacao",$recontratos[$i]['tabelas'][0]) ? !is_null($recontratos[$i]['tabelas'][0]["simulacao"]) ? sizeof($recontratos[$i]['tabelas'][0]["simulacao"]) : 0 : 0;

            $i++;
        }

        return response()->json($recontratos,200);

    }

    public function checkTemRegras($id_tabela){
        return DB::table('regras_negocio_tabela_portabilidade')->where('id_tabela','=',$id_tabela)->count() > 0 ? true : false;
    }


    public function checkBloqueioByTabela($parametros){

        $idade = (int)$parametros['idade'];
        $id_tabela = (int)$parametros['id_tabela'];
        $especie = (int)$parametros['especie'];
        $cod_banco_cliente = (int)$parametros['cod_banco_cliente'];
        $alfabetizado = $parametros['alfabetizado'];
        $ordem_pagamento = $parametros['ordem_pagamento'];
        $parcelas_pagas = (int)$parametros['parcelas_pagas'];
        $total_parcelas = (int)$parametros['total_parcelas'];
        $valor_parcela = $parametros['valor_parcela'];
        $coeficiente = $parametros['coeficiente'];
        $saldo_quitacao = $parametros['saldo_quitacao'];
        $representante_legal = (int)$parametros['idade'];
        $tipo = $parametros['tipo'];
        $valor = $parametros['valor_parcela'] > 0 && $parametros['coeficiente'] > 0 ? $parametros['valor_parcela'] / $parametros['coeficiente'] : 0.00;

        $block = false;
        $blockBy = [];
        $blockByLabel = [];
        $especies_permitidas = [];

        try {

            $check_generica = DB::table('regras_negocio_tabela AS RNT')
                ->join('regras_negocio as RN','RNT.id_regra_negocio','=','RN.id')
                ->selectRaw('RNT.*, RN.tipo, RN.regra, RN.bloqueado')
                ->whereRaw('RNT.id_regra_negocio = ?', [34])
                ->whereRaw('RNT.id_tabela = ?',[$id_tabela])
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
                    }

                }
            }

            $regras = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                ->join('banco AS B','RNT.id_banco','=','B.id')
                ->selectRaw('RNT.*, R.tipo, B.banco_codigo')
                ->where('id_tabela','=',$id_tabela)
                ->where('id_regra_negocio','<>',34)
                ->get();

            foreach($regras as $regra){

                if($tipo === 'Refinanciamento'){
                    if($regra->banco_codigo != $cod_banco_cliente){
                        $block = true;
                        $blockBy[] = 99;
                        $blockByLabel[] = 'Banco diferente não aceita refinanciamento';
                    }
                }else if($tipo === 'Portabilidade'){
                    if($regra->banco_codigo == $cod_banco_cliente){
                        $block = true;
                        $blockBy[] = 99;
                        $blockByLabel[] = 'Mesmo banco não permiti portabilidade';
                    }
                }

                switch((int)$regra->id_regra_negocio){

                    case 2 : {

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->whereRaw("FIND_IN_SET(?, bancos_portados)",[$cod_banco_cliente])
                            ->where('RNT.id_regra_negocio', '=', 2);

                        if($check->count() <= 0) {
                            $block = true;
                            $blockBy[] = 2;
                            $blockByLabel[] = 'Banco cliente não consta em bancos portados';
                        }
                        break;

                    }

                    case 3 : {

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->whereRaw("FIND_IN_SET(?, bancos_nao_portados)",[$cod_banco_cliente])
                            ->where('RNT.id_regra_negocio', '=', 3);

                        if($check->count() >= 0) {
                            $block = true;
                            $blockBy[] = 3;
                            $blockByLabel[] = 'Bancos não portados';
                        }
                        break;

                    }

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

                    case 7 : {

                        if($ordem_pagamento) {

                            $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
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

                    case 18 : {

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->where('RNT.valor','<=', $parcelas_pagas)
                            ->where('RNT.id_regra_negocio', '=', 18);

                        if($check->count() > 0) {
                            $block = true;
                            $blockBy[] = 18;
                            $blockByLabel[] = 'Quantidade parcelas pagas maximo';
                        }
                        break;

                    }

                    case 19 : {

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->where('RNT.valor','>=', $parcelas_pagas)
                            ->where('RNT.id_regra_negocio', '=', 19);

                        if($check->count() > 0) {
                            $block = true;
                            $blockBy[] = 19;
                            $blockByLabel[] = 'Quantidade parcelas pagas minimo';
                        }
                        break;

                    }

                    case 20 : {

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->where('RNT.valor','>', $parcelas_pagas)
                            ->where('RNT.id_regra_negocio', '=', 20);

                        if($check->count() > 0) {
                            $block = true;
                            $blockBy[] = 20;
                            $blockByLabel[] = 'Quantidade parcelas para quitar';
                        }
                        break;

                    }

                    case 22 : {

                        $valor_novo = $valor_parcela > 0 && $coeficiente > 0 ? $valor_parcela / $coeficiente : 0.00;
                        $troco = number_format($saldo_quitacao - $valor_novo,2,'.','');

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->where('RNT.valor','>', $troco)
                            ->where('RNT.id_regra_negocio', '=', 20);

                        if($check->count() > 0) {
                            $block = true;
                            $blockBy[] = 22;
                            $blockByLabel[] = 'Troco Minimo';
                        }
                        break;

                    }

                    case 30 : {

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->where('RNT.valor','>=', $saldo_quitacao)
                            ->where('RNT.id_regra_negocio', '=', 30);

                        if($check->count() > 0) {
                            $block = true;
                            $blockBy[] = 30;
                            $blockByLabel[] = 'Valor quitação Mínimo';
                        }
                        break;

                    }

                    case 33 : {

                        $check = DB::table('regras_negocio_tabela AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->where('RNT.valor', '=', 1)
                            ->where('R.bloqueado', '=', 1)
                            ->where('RNT.id_regra_negocio', '=', 33);

                        if($check->count() > 0 && in_array($representante_legal,[0,'Não'])) {
                            $block = true;
                            $blockBy[] = 33;
                            $blockByLabel[] = 'Bloqueia Representante Legal';
                        }

                        break;

                    }

                    case 38 : {

                        $check = DB::table('regras_negocio_tabela_portabilidade AS RNT')
                            ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                            ->selectRaw('RNT.*, R.tipo, R.regra')
                            ->where('RNT.id_tabela', '=', $regra->id_tabela)
                            ->where('RNT.valor','>=', $parcelas_pagas)
                            ->whereRaw("FIND_IN_SET(?, bancos_portados)",[$cod_banco_cliente])
                            ->where('RNT.id_regra_negocio', '=', 30);

                        if($check->count() <= 0) {
                            $block = true;
                            $blockBy[] = 35;
                            $blockByLabel[] = 'Valor quitação Mínimo';
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

            return ['status'=>'ok','data'=>['block'=>$block,'blockBy'=>array_unique($blockBy),'blockByLabel'=>array_unique($blockByLabel),'especies_permitidas'=>$especies_permitidas],'message'=>'Validação efetuada com sucesso.'];


        }catch (\Exception $e){
            return ['status'=>'error', 'data'=>[], 'message'=>'Erro ao verificar os bloqueios -> '.$e->getMessage().' na linha '.$e->getLine()];
        }

    }

    public function simulacoes($id_beneficio,$id_contrato,$id_tabela,$tipo){

        try {

            $iteracoes = 0;
            $validacoes = [];

            $margem = DB::table('inss_historico_margem AS BM')
                ->join('beneficios_cpf AS B','BM.id_beneficio','=','B.id')
                ->where('BM.id_beneficio','=',$id_beneficio)
                ->first();

            $dados_bancarios = DB::table('inss_dados_bancarios')
                ->where('id_beneficio','=',$id_beneficio)
                ->first();

            $cliente = DB::table('cliente')
                ->where('id','=',$margem->id_cliente)
                ->first();

            $tabela = DB::table('portabilidade AS P')->where('id','=',$id_tabela)->first();

            $dateOfBirth = Carbon::parse($cliente->data_nascimento);
            $now = Carbon::now();

            $dados_contrato = DB::table('inss_historico_contratos_emprestimo as C')
                ->where('id_beneficio','=',$id_beneficio)
                ->where('id','=',$id_contrato)
                ->first();

            $especie = $margem->especie;
            $alfabetizado = $cliente->alfabetizado;
            $tem_representante_legal = $margem->possui_representante_legal;
            $idade = $dateOfBirth->diffInYears($now);
            $margem_disponivel = (float)$margem->margem_disponivel_emprestimo;
            $ordem_pagamento = !is_object($dados_bancarios) ? 1 : 0;
            $data_dib = $margem->dib;
            $uf = $margem->uf;
            $cod_banco_cliente = $dados_contrato->banco_codigo;
            $saldo_quitacao = $dados_contrato->saldo_quitacao;
            $parcelas_pagas = $dados_contrato->quantidade_parcelas-$dados_contrato->quantidade_parcelas_emaberto;
            $total_parcelas = $dados_contrato->quantidade_parcelas;
            $coeficiente = isset($tabela->coeficiente) > 0 ? $tabela->coeficiente : 0.0268500;
            $valor_parcela = $dados_contrato->valor_parcela;

            $simulacao = null;

            $parametros = [
                'id_tabela'=>$tabela->id,
                'especie'=>$especie,
                'idade'=>$idade,
                'margem_disponivel'=>$margem_disponivel,
                'data_dib'=>$data_dib,
                'uf'=>$uf,
                'alfabetizado'=>$alfabetizado,
                'tem_representante_legal'=>$tem_representante_legal,
                'ordem_pagamento'=>$ordem_pagamento,
                'cod_banco_cliente'=>$cod_banco_cliente,
                'saldo_quitacao'=>$saldo_quitacao,
                'parcelas_pagas'=>$parcelas_pagas,
                'total_parcelas'=>$total_parcelas,
                'coeficiente'=>$coeficiente,
                'valor_parcela'=>$valor_parcela,
                'tipo'=>$tipo
            ];

            $check_regras = $this->checkTemRegras($tabela->id);

            $coeficientes = [];
            $motivo_bloqueio = [];

            if($check_regras){

                $validacao = $this->checkBloqueioByTabela($parametros);
                $validacoes[] = $validacao;

                if($validacao['status']=='ok'){
                    $bloqueado = $validacao['data']['block'];

                    if(!$bloqueado){
                        $prazo = $tabela->prazo;
                        $valor_total = ($valor_parcela > 0 && $coeficiente > 0) ? $valor_parcela / $coeficiente : 0.00;
                        $troco = $valor_total - $saldo_quitacao;

                        $simulacao = ['id_tabela' => $tabela->id, 'label' => $tabela->nome_tabela, 'coeficiente' => $tabela->coeficiente, 'prazo'=>$prazo, 'valor_total' => number_format($valor_total,2,'.',''), 'troco'=>number_format($troco,2,'.','')];
                    }else{
                        $motivo_bloqueio = ['id_tabela'=>$tabela->id,'tabela'=>$tabela->nome_tabela,'block'=>$validacao['data']['block'],'blockByRegras'=>$validacao['data']['blockBy'],'blockByRegrasLabel'=>$validacao['data']['blockByLabel']];
                    }
                }

            }

            unset($coeficientes);
            $iteracoes++;

            return [
                'simulacao'=>$simulacao,
                'motivo_bloqueio'=>$motivo_bloqueio,
                'iteracoes'=>$iteracoes,
                'parametros'=>$parametros
            ];

        }catch (\Exception $e){
            return ['status'=>'error','simulacoes'=>[],'message'=>$e->getMessage(),'line'=>$e->getLine()];
        }

    }

    public function simulacao(Request $request){

        $id_historico_contrato = $request->id_historico_contrato;
        $tipo = $request->tipo;

        try {

            $historico = DB::table('inss_historico_contratos_emprestimo as HC')
                ->join('banco as B','HC.banco_codigo','=','B.banco_codigo')
                ->selectRaw('HC.*, B.id as id_banco')
                ->where('HC.id','=',$id_historico_contrato)
                ->first();

            if(is_object($historico)){
                $portabilidade = Portabilidade::where('id_banco','<>',$historico->id_banco)->get();
                $refinanciamento = Portabilidade::where('id_banco','=',$historico->id_banco)->get();
            }

            return response()->json(['historico'=>$historico, 'portabilidade'=>$portabilidade,'refinanciamento'=>$refinanciamento]);

        }catch (\Exception $e){

        }

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function select(Request $request)
    {

        try {

            $term = isset($request->term) ? $request->term : null;

            $all = DB::table('tabela AS T')
                ->join('banco AS B','T.id_banco','=','B.id')
                ->selectRaw('T.*, B.nome_banco')
                ->when(!is_null($term),function($q)use($term){
                    $q->where('T.nome','LIKE','%'.$term.'%');
                    $q->orWhere('T.id','=',(int)$term);
                })
                ->get();

            return response()->json($all,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        try {

            $add = Portabilidade::create([
                'id_banco' => $request->id_banco,
                'nome_tabela' => $request->nome_tabela,
                'tipo' => $request->tipo,
                'prazo_inicio' => $request->prazo_inicio,
                'prazo_fim' => $request->prazo_fim,
                'coeficiente' => $request->coeficiente,
                'idade_min' => $request->idade_min,
                'idade_max' => $request->idade_max,
                'taxa_juros_minima' => $request->taxa_juros_minima,
                'seguro' => $request->seguro,
            ]);

            return response()->json(['message'=>'Cadastro realizado com sucesso.','status'=>'error'],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
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

        $dados = Portabilidade::findOrFail($id);

        return response()->json($dados);
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

        $validator = Validator::make($request->all(), [
            'id_banco' => 'required',
            'nome_tabela' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Os dados fornecidos são inválidos.',
                'errors' => $validator->errors()
            ], 400);
        }

        Portabilidade::where('id','=',$id)->update([
            'id_banco' => $request->id_banco,
            'nome_tabela' => $request->nome_tabela,
            'tipo' => $request->tipo,
            'prazo_inicio' => $request->prazo_inicio,
            'prazo_fim' => $request->prazo_fim,
            'coeficiente' => $request->coeficiente,
            'idade_min' => $request->idade_min,
            'idade_max' => $request->idade_max,
            'taxa_juros_minima' => $request->taxa_juros_minima,
            'seguro' => $request->seguro,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        Portabilidade::where('id','=',$id)->update(['status'=>0]);

        return response()->json(['status'=>'ok','message'=>'DELETE']);
    }

    public function addRegraTabela(Request $request){

        try {

            RegrasNegocioTabelaPortabilidade::create([
                'id_banco' => $request->id_banco,
                'id_tabela' => $request->id_tabela,
                'id_regra_negocio' => $request->id_regra_negocio,
                'idade_de' => $request->idade_de,
                'idade_ate' => $request->idade_ate,
                'prazo_de' => $request->prazo_de,
                'prazo_ate' => $request->prazo_ate,
                'valor_de' => $request->valor_de,
                'valor_ate' => $request->valor_ate,
                'valor' => $request->valor,
                'especies_bloqueadas' => $request->especies_bloqueadas,
                'especies_permitidas' => $request->especies_permitidas,
                'bancos_portados' => $request->bancos_portados,
                'bancos_nao_portados' => $request->bancos_nao_portados
            ]);

            return response()->json(['status'=>'ok','message'=>'Regra adicionada com sucesso.']);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
        }

    }

    public function listRegrasTabela($id_tabela){

        try {

            $data = DB::table('regras_negocio_tabela_portabilidade AS RP')
                ->join('banco AS B','RP.id_banco','=','B.id')
                ->join('portabilidade AS T','RP.id_tabela','=','T.id')
                ->join('regras_negocio AS R','RP.id_regra_negocio','=','R.id')
                ->selectRaw('RP.*, T.nome_tabela, R.regra, B.nome_banco, R.tipo')
                ->where('RP.id_tabela','=',$id_tabela)
                ->orderBy('RP.id_banco')
                ->get();

            return response()->json(['status'=>'ok','data'=>$data]);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
        }

    }

    public function delRegraTabela($id_regra_produto){

        try {

            DB::table('regras_negocio_tabela_portabilidade')
                ->where('id','=',$id_regra_produto)
                ->delete();

            return response()->json(['status'=>'ok','message'=>'Regra apagada com sucesso.']);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
        }

    }

}
