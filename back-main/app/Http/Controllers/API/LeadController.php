<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\FunctionsController;
use App\Models\Beneficios;
use App\Models\ConsultaCredito;
use App\Models\HistoricoContatosLead;
use App\Models\Lead;
use App\Models\Produto;
use App\Models\XMLCredito;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LeadController extends Controller
{

    public function removerAcentos($string) {

        $unwanted_array = array('Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
            'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
            'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
            'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
            'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y' );
        $string = strtr( $string, $unwanted_array );

        // Converte para minúsculas
        $string = strtolower($string);

        $string = str_replace(' ', '-', $string);
        $string = str_replace('+', '-', $string);

        return $string;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {

        try {

            $key = isset($request->key) ? $request->key : null;
            $categoria = isset($request->categoria) ? $request->categoria : 'todos';
            $startDate = isset($request->startDate) ? Carbon::parse($request->startDate)->startOfDay()->format('Y-m-d H:i:s') : Carbon::now()->subDays(7)->startOfDay()->format('Y-m-d H:i:s');
            $endDate = isset($request->endDate) ? Carbon::parse($request->endDate)->endOfDay()->format('Y-m-d H:i:s') : Carbon::now()->endOfDay()->format('Y-m-d H:i:s');
            $produto = strlen($request->produto) > 0 ? explode(',',$this->removerAcentos($request->produto)) : [];

            $dataDB = DB::table('lead AS L')
                ->leftJoin('cliente AS C','C.cpf','=',DB::raw('REPLACE(REPLACE(REPLACE(L.cpf, \'.\', \'\'), \'-\', \'\'), \' \', \'\')'))
                ->selectRaw('L.*, L.updated_at as enviado_em, L.id as idLead, L.created_at as primeira_consulta, IF(L.created_at <> L.updated_at, 1, 0) as recorrente, C.data_nascimento, FLOOR(DATEDIFF(CURDATE(), C.data_nascimento) / 365) as idade_calculada, DATE_FORMAT(C.data_nascimento, \'%d/%m/%Y\') as data_nascimento_formatada')
                ->whereBetween('L.updated_at',[$startDate,$endDate])
                ->where('L.status','=',1)
                ->when(sizeof($produto) >= 1,function($query) use ($produto){
                    $query->whereIn('L.produto',$produto);
                })
                ->when($categoria != 'todos',function($query) use ($categoria){
                    $query->where('L.categoria','=',$categoria);
                })
                ->when(!is_null($key),function($query) use ($key){
                    if(is_numeric($key)){
                        $query->where('L.cpf','LIKE','%'.$key.'%');
                    }else{
                        $query->where('L.nome','LIKE','%'.$key.'%');
                    };
                })
                ->groupBy('L.cpf')
                ->orderBy('L.updated_at','DESC');

            $sql = $dataDB->toSql();

            $params = $dataDB->getBindings();
            $leads = $dataDB->paginate(100);

            $leads->getCollection()->transform(function ($item) {

                $beneficiosComCredito = $this->getSimulacoesDisponiveis($item->cpf,1,'online');
                $beneficiosSemCredito = $this->getSimulacoesDisponiveis($item->cpf,0,'online');

                $beneficiosOffline = $this->getSimulacoesDisponiveis($item->cpf,'A','offline');
                $beneficiosOnlineBlock = $this->getSimulacoesDisponiveis($item->cpf,'A','online');

                $erros = $this->getErros($item->cpf);
                $naoEncontrado = $this->getNaoEncontrado($item->cpf);

                $item->beneficios_com_credito = $beneficiosComCredito;
                $item->beneficios_sem_credito = $beneficiosSemCredito;
                $item->beneficios_online_block = $beneficiosOnlineBlock;
                $item->beneficios_offline = $beneficiosOffline;
                $item->erros = $erros;
                $item->naoEncontrado = $naoEncontrado;

                return $item;
            });

            $produtos = Produto::all();

            $data['leads'] = $leads;
            $data['produtos'] = $produtos;

            return response()->json([
                'json'=>$data,
                'status'=>'ok',
                'sql'=>$sql,
                'params'=>$params
            ], 200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error','line'=>$e->getLine()],400);
        }

    }

    public function getCoeficiente()
    {
        return DB::table('coeficiente')
            ->where('data','=',date('Y-m-d'))
            ->where('qtde_parcela','=',84)
            ->first();
    }

    public function getErros($cpf){

        try {

            $cpf = FunctionsController::onlyNumbers($cpf);

            return DB::table('errors_apis')->where('cpf','=',$cpf)->whereIn('error_code',[503,500,403,400])->get();

        }catch (\Exception $e){
            return [];
        }

    }

    public function getNaoEncontrado($cpf){

        try {

            $cpf = FunctionsController::onlyNumbers($cpf);

            return DB::table('errors_apis')->where('cpf','=',$cpf)->where('error_code','=',404)->get();

        }catch (\Exception $e){
            return [];
        }

    }

    public function getSimulacoesDisponiveis($cpf,$tipo,$onoff='online'){

        $cpf = FunctionsController::onlyNumbers($cpf);

        $coeficiente = $this->getCoeficiente();
        $coeficiente = is_object($coeficiente) ? $coeficiente->coeficiente : 0.0236570;

        $beneficios = DB::table('consulta_credito AS CC')
            ->join('beneficios_cpf AS B','B.cc_id','=','CC.id')
            ->leftJoin('simulacoes_disponiveis AS SD','SD.id_beneficio','=','B.id')
            ->leftJoin('inss_historico_margem AS M','M.id_beneficio','=','B.id')
            ->leftJoin('xml_credito AS X','X.id_beneficio','=','B.id')
            ->selectRaw('SD.*, B.beneficio, X.tipo, B.especie, B.situacao, M.margem_disponivel_emprestimo, REPLACE(FORMAT((M.margem_disponivel_emprestimo / ?),2),",","") as credito_calculado, margem_margem_disponivel_cartao, margem_disponivel_cartao_beneficio, X.id_beneficio',[$coeficiente])
            ->when(is_numeric($tipo) && $onoff=='online',function($query) use ($cpf,$tipo){
                if($tipo==0){
                    $query->whereRaw('(COALESCE(SD.credito_margem,0)+COALESCE(SD.credito_refin_portabilidade,0)) <= ? AND X.tipo=?',[0,'online']);
                }else{
                    $query->whereRaw('(COALESCE(SD.credito_margem,0)+COALESCE(SD.credito_refin_portabilidade,0)) >= ? AND X.tipo=?',[1,'online']);
                }
            })
            ->when($onoff=='offline',function($query) use ($tipo){
                $query->where('X.tipo','=','offline');
            })
            ->when($onoff=='online',function($query) use ($tipo){
                $query->where('X.tipo','=','online');
            })
            ->where('CC.cpf','=',$cpf)
            ->groupBy('B.beneficio')
            ->get();

        $beneficios->transform(function ($item) use($coeficiente) {
            $item->coeficiente = $coeficiente;
            return $item;
        });

        return $beneficios;

    }

    public function getBeneficiosByCpf($cpf=null){

        try {

            $cpf = !is_null($cpf) ? $cpf : null;

            $bnDB = DB::table('beneficios_cpf AS B1')
                ->leftJoin('inss_historico_margem AS M','M.id_beneficio','=','B1.id')
                ->join(DB::raw('(SELECT cpf, beneficio, MAX(created_at) AS data_recente FROM beneficios_cpf GROUP BY beneficio) as B2'), function ($join) {
                    $join->on('B1.beneficio', '=', 'B2.beneficio')
                        ->on('B1.created_at', '=', 'B2.data_recente');
                })
                ->when(!is_null($cpf),function($q) use ($cpf){
                    $q->where('B1.cpf','=',$cpf);
                })
                ->where('B1.situacao','LIKE','%ATIVO%')
                ->selectRaw('B1.*, M.margem_disponivel_emprestimo')
                ->get();

            $total = 0.00;
            foreach ($bnDB as $item){

                $valor = FunctionsController::toMoneyAll($item->margem_disponivel_emprestimo);
                $total += $valor;

                $bn[] = [
                    'id'=>$item->id,
                    'especie'=>$item->especie,
                    'situacao'=>$item->situacao,
                    'margem_disponivel_emprestimo_raw'=>$valor,
                    'margem_disponivel_emprestimo'=>$item->margem_disponivel_emprestimo,
                    'total_parcial' => $total
                ];
            }

            if(is_array($bn)){
                return $bn;
            }else{
                return null;
            }

        }catch (\Exception $e){
            return null;
        }

    }

    public function leadsSemCredito(Request $request){

        try {

            $key = isset($request->key) ? $request->key : null;
            $startDate = isset($request->startDate) ? Carbon::parse($request->startDate)->startOfDay()->format('Y-m-d H:i:s') : Carbon::now()->subDays(7)->startOfDay()->format('Y-m-d H:i:s');
            $endDate = isset($request->endDate) ? Carbon::parse($request->endDate)->endOfDay()->format('Y-m-d H:i:s') : Carbon::now()->endOfDay()->format('Y-m-d H:i:s');
            $produto = $request->produto;

            $dataDB = DB::table('lead AS L')
                ->leftJoin('cliente AS C','C.id_lead','=','L.id')
                ->leftJoin('consulta_credito AS CC','CC.lead_id','=','L.id')
                ->leftJoin('beneficios_cpf AS B','B.cc_id','=','CC.id')
                ->leftJoin('inss_historico_margem AS IM','IM.id_beneficio','=','B.id')
                ->selectRaw('L.*, L.created_at as enviado_em, L.id as idLead, C.data_nascimento, FLOOR(DATEDIFF(CURDATE(), C.data_nascimento) / 365) as idade_calculada, SUM(IM.margem_disponivel_emprestimo) as total_beneficios, GROUP_CONCAT(B.id) AS beneficios, GROUP_CONCAT(B.especie) AS especies, GROUP_CONCAT(B.situacao) AS situacoes, GROUP_CONCAT(IM.margem_disponivel_emprestimo) AS margens, GROUP_CONCAT(B.beneficio) AS nbs')
                ->whereBetween('L.created_at',[$startDate,$endDate])
                ->where('L.status','=',1)
                ->when(strlen($produto) > 0,function($query) use ($produto){
                    $query->where('L.produto','LIKE','%'.$produto.'%');
                })
                ->when(!is_null($key),function($query) use ($key){
                    $query->where('L.nome','LIKE','%'.$key.'%')
                        ->orWhere('L.cpf','LIKE','%'.$key.'%');
                })
                ->groupBy('L.cpf')
                ->havingRaw('COALESCE(total_beneficios,0.00) <= ?',[0.00])
                ->orderBy('L.created_at','DESC');

            $sql = $dataDB->toSql();

            $params = $dataDB->getBindings();
            $data = $dataDB->paginate(20);

            $produtosDB = Lead::select('produto')
                ->groupBy('produto')
                ->whereNotNull('produto')
                ->where('produto','<>','Selecione')
                ->orderBy('produto')
                ->get();

            $produtos = [];
            foreach ($produtosDB as $produto){
                $produtos[] = $produto->produto;
            }

            return response()->json([
                'data'=>$data,
                'status'=>'ok',
                'sql'=>$sql,
                'params'=>$params,
                'produtos' => $produtos
            ], 200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error','line'=>$e->getLine()],400);
        }

    }

    public function getXMLConsulta($cpf){

        try {

            $cpf = FunctionsController::onlyNumbers($cpf);

            if($cpf==0){
                return response()->json(['status'=>'ok','consulta'=>'ok','xmls_online'=>[]]);
            }

            $xml_beneficios = ConsultaCredito::where('cpf','=',$cpf)
                ->orderBy('id','DESC')
                ->first();

            $xmls_online = XMLCredito::where('cpf','=',$cpf)->get();

            if(is_object($xml_beneficios)){
                return response()->json(['status'=>'ok', 'consulta'=>$xml_beneficios->json_response,'xmls_online'=>$xmls_online]);
            }else{
                return response()->json(['status'=>'ok', 'consulta'=>'Nenhuma consulta para o CPF '.$cpf,'xmls_online'=>[]]);
            }

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
        }

    }

    public function getXMLConsultaById($id_beneficio,$tipo='online'){

        try {
            $xml_online = XMLCredito::where('id_beneficio','=',$id_beneficio)->where('tipo','=',$tipo)->first();

            if(is_object($xml_online)){
                return response()->json(['status'=>'ok', 'xml_online'=>$xml_online]);
            }else{
                return response()->json(['status'=>'ok', 'xml_online'=>'Não encontrado']);
            }

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage(),'xml_online'=>'Não encontrado '.$e->getMessage()]);
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $input = $request->all();
            $validator = Validator::make($input, [
                'nome' => 'required',
                'cpf' => 'required'
            ]);
            if($validator->fails()){
                return response()->json(['message'=>$validator->errors(),'status'=>'error'],203);
            }
            $lead = Lead::create($input);
//            $lead = $input;

            return response()->json(['message'=>'Lead cadastrado com sucesso.','status'=>'ok','data'=>$lead],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Lead  $lead
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Lead $lead)
    {
        try {

            $lead = Lead::where('id',$lead->id)->first();

            return response()->json(['message'=>'Consulta realizada com sucesso.','status'=>'ok','data'=>$lead],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Lead  $lead
     * @return \Illuminate\Http\Response
     */
    public function edit(Lead $lead)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Lead  $lead
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request,$id)
    {
        try {

            $input = $request->all();

            $validator = Validator::make($input, [
                'nome' => 'required',
                'cpf' => 'required'
            ]);
            if($validator->fails()){
                return response()->json(['message'=>$validator->errors(),'status'=>'error'],400);
            }

            $up = Lead::findOrFail($id);
            $up->update($input);

            return response()->json(['message'=>'Lead alterado com sucesso.','status'=>'ok','data'=>$up],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Lead  $lead
     * @return \Illuminate\Http\Response
     */
    public function destroy(Lead $lead)
    {
        //
    }

    /**
     * List the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Lead  $lead
     * @return \Illuminate\Http\JsonResponse
     */
    public function leadsBoard(Request $request, Lead $lead)
    {

        try {

            $leads = DB::table('leads_boards AS B')->get();

            $board = [];
            foreach ($leads as $lead) {
                $board[] = ['id'=>$lead->status,'title'=>$lead->board_title,'cards'=>$this->cardsByStatus($lead->status)];
            }
            $return = ['columns'=>$board];

            return response()->json(mb_convert_encoding($return, "UTF-8", "auto"),200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function cardsByStatus($status){

        try {

            $leads = DB::table('lead AS L')
                ->selectRaw('L.*')
                ->where('status_board', '=', $status)
                ->orderBy('created_at','ASC')
                ->orderBy('nome','ASC')
                ->limit(50)
                ->get();

            $leadsCards = [];
            foreach ($leads as $lead) {
                $leadsCards[] = ['id'=>$lead->id,'nome'=>substr($lead->nome,0,20).'...','canal'=>$lead->canal,'historico_count'=>$this->historicoLead($lead->id)];
            }

            return $leadsCards;

        }catch (\Exception $e){
            return [];
        }

    }

    public function historicoLead($id){
        return HistoricoContatosLead::where('id_lead','=',$id)->count();
    }

    public function getBoardTitles($board_id){

        switch($board_id){
            case 1 : return 'Consultas'; break;
            case 2 : return 'Simulações'; break;
            case 3 : return 'Documentação'; break;
            case 4 : return 'Em análise'; break;
            case 5 : return 'Aprovados'; break;
            case 6 : return 'Finalizados'; break;
            default : return 'Ops'; break;
        }

    }

    public function changeLeadBoard(Request $request){

        try {

            $id = $request->id;
            $from_status = $request->from_status;
            $to_status = $request->to_status;

            $up = Lead::where('id','=',$id)->update(['status_board'=>$to_status]);

            return response()->json($up,200);

        }catch (\Exception $e){
            return response()->json($e,400);
        }

    }


}
