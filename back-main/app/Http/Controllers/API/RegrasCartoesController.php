<?php

namespace App\Http\Controllers\API;

use App\Models\Portabilidade;
use App\Models\RegrasNegocioTabelaCartao;
use DB;
use App\Models\Cliente;
use App\Models\RegrasCartao;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegrasCartoesController extends Controller
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

            $all = DB::table('regras_cartoes AS R')
                ->join('produto AS P','R.id_produto','=','P.id')
                ->selectRaw('R.*, P.produto')
                ->when(!is_null($term),function($q) use ($term){
                    $q->where('R.nome_regra','LIKE','%'.$term.'%');
                    $q->orWhere('R.id','=',(int)$term);
                })
                ->get();

            return response()->json($all,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function checkTemRegras($id_tabela){
        return DB::table('regras_negocio_tabela_cartoes')->where('id_tabela','=',$id_tabela)->count() > 0 ? true : false;
    }

    public function checkBloqueioByTabela($id_tabela=0,$idade=99,$valor=0.00,$especie='0',$dataDIB=null,$uf='PR',$alfabetizado=true,$representante_legal=false,$ordem_pagamento=false){

        $idade = (int)$idade;
        $especie = (int)$especie;
        $block = false;
        $blockBy = [];
        $blockByLabel = [];

        try {

            $checks = DB::table('regras_negocio_tabela_cartoes AS RNT')
                ->join('regras_negocio as RN','RNT.id_regra_negocio','=','RN.id')
                ->selectRaw('RNT.*, RN.tipo, RN.regra, RN.bloqueado')
                ->when($idade > 0,function($query) use ($idade){
                    $query->whereRaw('RNT.idade_de <= ? AND RNT.idade_ate >= ?',[$idade,$idade]);
                })
                ->when($valor > 0,function($query) use ($valor){
                    $query->whereRaw('RNT.valor_de <= ? AND RNT.valor_ate >= ?',[$valor,$valor]);
                })
                ->whereRaw('RNT.id_regra_negocio = ?', [34])
                ->whereRaw('RNT.id_tabela = ?',[$id_tabela]);

            $checks = $checks->get();

            if(sizeof($checks) > 0){
                foreach ($checks as $check){
                    $especies_bloqueadas = explode(",",trim($check->especies_bloqueadas));
                    $especies_permitidas = explode(",",$check->especies_permitidas);

                    if(in_array($especie,$especies_bloqueadas)){
                        $block = true;
                        $blockBy[] = $check->id_regra_negocio;
                        $blockByLabel[] = $check->regra;
                    }else if(in_array($especie,$especies_permitidas)){
                        $block = false;
                    }
                }
            }

            $regras = DB::table('regras_negocio_tabela_cartoes AS RNT')
                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                ->selectRaw('RNT.*, R.tipo')
                ->where('id_tabela','=',$id_tabela)
                ->where('id_regra_negocio','<>',34)
                ->get();

            foreach($regras as $regra){

                switch((int)$regra->id_regra_negocio){

                    case 4 : {

                        if($alfabetizado===false) {

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
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

                            $dataDIBC = Carbon::parse($dataDIB)->format('Y-m-d');

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.id_regra_negocio', '=', 5)
                                ->whereRaw("STR_TO_DATE(RNT.valor, '%Y-%m-%d') <= ? AND FIND_IN_SET(?, especies_bloqueadas)",[$dataDIBC,$especie]);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 5;
                                $blockByLabel[] = 'Bloquear DIB anterior data';
                            }

                        }
                        break;

                    }

                    case 7 : {

                        if($ordem_pagamento) {

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
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

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.valor','<=',$idade)//exemplo idade mínima 20 e vem 15
                                ->where('RNT.id_regra_negocio', '=', 11);

                            if($check->count() <= 0) {
                                $block = true;
                                $blockBy[] = 11;
                                $blockByLabel[] = 'Idade mínima não atendida.';
                            }

                        }
                        break;

                    }

                    case 12 : {

                        if($idade > 0){

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.valor','<=',$idade)//exemplo 60 e vem 70
                                ->where('RNT.id_regra_negocio', '=', 12);

                            if($check->count() >= 0) {
                                $block = true;
                                $blockBy[] = 12;
                                $blockByLabel[] = 'Idade Maxima';
                            }

                        }
                        break;

                    }

                    case 23 : { //tempo mínimo DIB

                        try {

                            if(!is_null($dataDIB)) {

                                $dataDIBC = Carbon::parse($dataDIB)->format('Y-m-d');

                                $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
                                    ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                                    ->selectRaw('RNT.*, R.tipo, R.regra')
                                    ->where('RNT.id_tabela', '=', $regra->id_tabela)
                                    ->where('RNT.id_regra_negocio', '=', 23)
                                    ->whereRaw("STR_TO_DATE(RNT.valor, '%Y-%m-%d') >= ? AND FIND_IN_SET(?, especies_bloqueadas)",[$dataDIBC,$especie]);

                                if ($check->count() > 0) {
                                    $block = true;
                                    $blockBy[] = 23;
                                    $blockByLabel[] = 'Tempo Minimo DIB';
                                }

                            }

                        }catch (\Exception $e){

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
                                ->join('regras_negocio AS R','RNT.id_regra_negocio','=','R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela','=',$regra->id_tabela)
                                ->where('RNT.valor','>=',$dataDIB)
                                ->where('RNT.id_regra_negocio', '=', 23)
                                ->whereRaw('FIND_IN_SET(?, especies_bloqueadas)',[$especie]);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 23;
                                $blockByLabel[] = 'Tempo Minimo DIB';
                            }

                        }
                        break;

                    }

                    case 33 : {

                        if($representante_legal) {

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
                                ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela', '=', $regra->id_tabela)
                                ->where('RNT.valor', '=', 1)
                                ->where('R.bloqueado', '=', 1)
                                ->where('RNT.id_regra_negocio', '=', 33);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 33;
                                $blockByLabel[] = 'Bloqueia Representante Legal';
                            }

                        }
                        if(!$representante_legal) {

                            $check = DB::table('regras_negocio_tabela_cartoes AS RNT')
                                ->join('regras_negocio AS R', 'RNT.id_regra_negocio', '=', 'R.id')
                                ->selectRaw('RNT.*, R.tipo, R.regra')
                                ->where('RNT.id_tabela', '=', $regra->id_tabela)
                                ->where('RNT.valor', '=', 0)
                                ->where('R.bloqueado', '=', 1)
                                ->where('RNT.id_regra_negocio', '=', 33);

                            if($check->count() > 0) {
                                $block = true;
                                $blockBy[] = 33;
                                $blockByLabel[] = 'Bloqueia Representante Legal';
                            }

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

    public function coeficientesByTabela($id_tabela,$data,$valor=1000.00,$margem_disponivel=0.00){

        $coeficientes = DB::table('coeficiente AS C')
            ->selectRaw('C.coeficiente,C.qtde_parcela, C.data')
            ->where('C.data','=',$data)
            ->where('C.qtde_parcela','>',0)
            ->where('C.id_tabela','=',$id_tabela)
            ->orderBy('C.id_tabela')
            ->orderBy('C.qtde_parcela','DESC')
            ->get();

        $coeficientesCalc = [];
        if(sizeof($coeficientes) > 0){

            foreach($coeficientes as $coeficiente){

                $valor_parcela = number_format($valor*$coeficiente->coeficiente,2,'.','');

                if($margem_disponivel >= $valor_parcela){
                    $coeficientesCalc[] = ['coeficiente'=>$coeficiente->coeficiente,'qtde_parcela'=>$coeficiente->qtde_parcela,'data'=>$data,'valor_total'=>$valor_parcela];
                }
            }

            return $coeficientesCalc;
        }else{
            return ['coeficiente'=>0.00,'qtde_parcela'=>0,'data'=>$data,'valor_total'=>0.00];
        }

    }

    public function simulacoes($id_beneficio,$data,$valor=1000.00){

        try {

            $iteracoes = 0;
            $tabelas_bloqueadas = [];
            $validacoes = [];

            $margem = DB::table('inss_historico_margem AS BM')
                ->join('beneficios_cpf AS B','BM.id_beneficio','=','B.id')
                ->where('BM.id_beneficio','=',$id_beneficio)
                ->first();

            if(is_object($margem)){

                $dados_bancarios = DB::table('inss_dados_bancarios')
                    ->where('id_beneficio','=',$id_beneficio)
                    ->first();

                $cliente = DB::table('cliente')
                    ->where('id','=',$margem->id_cliente)
                    ->first();

                $dateOfBirth = Carbon::parse($cliente->data_nascimento);
                $now = Carbon::now();

                $alfabetizado = $cliente->alfabetizado;
                $margem_margem_disponivel_cartao = $margem->margem_margem_disponivel_cartao;
                $margem_disponivel_cartao_beneficio = $margem->margem_disponivel_cartao_beneficio;
                $margem_possui_cartao = $margem->margem_possui_cartao;
                $tem_representante_legal = $margem->possui_representante_legal;
                $idade = $dateOfBirth->diffInYears($now);
                $margem_disponivel = (float)$margem->margem_disponivel_emprestimo;
                $especie = (int)$margem->especie;
                $ordem_pagamento = !is_object($dados_bancarios) ? 1 : 0;
                $data_dib = $margem->dib;
                $uf = $margem->uf;

                $tabelas = DB::table('regras_cartoes AS T')
                    ->join('regras_negocio_tabela_cartoes AS R','T.id','=','R.id_tabela')
                    ->selectRaw('T.id,R.id_tabela, T.nome_regra, R.fator')
                    ->where('T.status','=',1)
                    ->groupBy('R.id_tabela')
                    ->get();

                $simulacoes = [];

                $parametros = [
                    'idade'=>$idade,
                    'margem_disponivel'=>$margem_disponivel,
                    'especie'=>$especie,
                    'data_dib'=>$data_dib,
                    'uf'=>$uf,
                    'alfabetizado'=>$alfabetizado,
                    'tem_representante_legal'=>$tem_representante_legal,
                    'ordem_pagamento'=>$ordem_pagamento,
                    'margem_possui_cartao'=>$margem_possui_cartao,
                    'margem_margem_disponivel_cartao'=>$margem_margem_disponivel_cartao,
                    'margem_disponivel_cartao_beneficio'=>$margem_disponivel_cartao_beneficio,
                ];

                foreach ($tabelas as $tabela){

                    $check_regras = $this->checkTemRegras($tabela->id);

                    $coeficientes = [];

                    if($check_regras){

                        $validacao = $this->checkBloqueioByTabela($tabela->id,$idade,$valor,$especie,$data_dib,$uf,$alfabetizado,$tem_representante_legal,$ordem_pagamento);
                        $validacoes[] = $validacao;

                        if($validacao['status']=='ok'){
                            $bloqueado = $validacao['data']['block'];

                            if(!$bloqueado && ($margem_disponivel_cartao_beneficio + $margem_margem_disponivel_cartao) > 0){

                                $fator = str_replace(",",".",$tabela->fator);

                                $simulacoes[] = ['id_tabela' => $tabela->id, 'label' => $tabela->nome_regra, 'fator' => $fator,'valor_disponivel'=>0.00,'margem_disponivel_cartao_beneficio'=>number_format($margem_disponivel_cartao_beneficio*$fator,2,'.',''),'margem_margem_disponivel_cartao'=>number_format($margem_margem_disponivel_cartao*$fator,2,'.','')];

                            }else{
                                $tabelas_bloqueadas[] = ['id_tabela'=>$tabela->id,'block'=>$validacao['data']['block'],'blockByRegras'=>$validacao['data']['blockBy'],'blockByRegrasLabel'=>$validacao['data']['blockByLabel']];
                            }
                        }

                    }else{

                        $coeficientes = $this->coeficientesByTabela($tabela->id,$data,$valor,$margem_disponivel);

                        $simulacoes[] = ['id_tabela'=>$tabela->id,'label'=>$tabela->nome_regra,'coeficientes'=>$coeficientes];
                    }

                    unset($coeficientes);
                    $iteracoes++;

                }

                return response()->json([
                    'status'=>'ok',
                    'simulacoes'=>$simulacoes,
                    'message'=>'Simulações calculadas para a data.',
                    'tabelas_bloqueadas'=>$tabelas_bloqueadas,
                    'parametros'=>$parametros,
                    'iteracoes'=>$iteracoes,
                    //'validacoes'=>$validacoes
                ],200);

            }else{
                return response()->json(['status'=>'error','simulacoes'=>[],'message'=>'Margem não encontrada.'],200);
            }

        }catch (\Exception $e){
            return response()->json(['status'=>'error','simulacoes'=>[],'message'=>$e->getMessage()]);
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

            RegrasCartao::create([
                'id_produto' => $request->id_produto,
                'nome_regra' => $request->nome_regra,
                'tipo' => $request->tipo,
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

        $dados = DB::table('regras_cartoes AS R')
            ->join('produto AS P','R.id_produto','=','P.id')
            ->selectRaw('R.*, P.produto')
            ->where('R.id','=',$id)
            ->first();

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
            'id_produto' => 'required',
            'nome_regra' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Os dados fornecidos são inválidos.',
                'errors' => $validator->errors()
            ], 400);
        }

        RegrasCartao::where('id','=',$id)->update([
            'id_produto' => $request->id_produto,
            'nome_regra' => $request->nome_regra,
            'tipo' => $request->tipo,
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

        RegrasCartao::where('id','=',$id)->update(['status'=>0]);

        return response()->json(['status'=>'ok','message'=>'DELETE']);
    }

    public function addRegraTabela(Request $request){

        try {

            RegrasNegocioTabelaCartao::create([
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
                'fator' => $request->fator,
            ]);

            return response()->json(['status'=>'ok','message'=>'Regra adicionada com sucesso.']);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
        }

    }
    public function listRegrasTabela($id_tabela){

        try {

            $data = DB::table('regras_negocio_tabela_cartoes AS RP')
                ->join('banco AS B','RP.id_banco','=','B.id')
                ->join('regras_cartoes AS T','RP.id_tabela','=','T.id')
                ->join('regras_negocio AS R','RP.id_regra_negocio','=','R.id')
                ->selectRaw('RP.*, T.nome_regra, R.regra, B.nome_banco, R.tipo')
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

            DB::table('regras_negocio_tabela_cartoes')
                ->where('id','=',$id_regra_produto)
                ->delete();

            return response()->json(['status'=>'ok','message'=>'Regra apagada com sucesso.']);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
        }

    }

}
