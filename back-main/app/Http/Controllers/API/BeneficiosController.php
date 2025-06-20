<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\FunctionsController;
use App\Models\Beneficios;
use App\Models\Coeficiente;
use App\Models\Comissao;
use App\Models\EsteiraProposta;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BeneficiosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        try {

            $key = isset($request->key) ? $request->key : null;
            $startDate = isset($request->startDate) ? Carbon::parse($request->startDate)->format('Y-m-d') : Carbon::now()->subDays(3)->format('Y-m-d');
            $endDate = isset($request->endDate) ? Carbon::parse($request->endDate)->format('Y-m-d') : Carbon::now()->format('Y-m-d');

            $data = DB::table('beneficios_cpf as B')
                ->join('consulta_credito AS CC','B.cc_id','=','CC.id')
                ->join('users AS U','CC.user_id','=','U.id')
                ->join('apis AS API','CC.provider','=','API.id')
                ->selectRaw('B.*, U.name as colaborador, API.api_name, API.tabela_propria')
                ->whereBetween('B.created_at',[$startDate,$endDate.' 23:59:59'])
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

    public function getBestCommission(){

        $comissao = Comissao::orderBy('percent_comissao','DESC')->first();

        return $comissao;

    }

    public function getBestTableCoefficient($id_tabela,$parcelas=null){

        $coeficiente = Coeficiente::where('id_tabela','=',$id_tabela)
            ->when(!is_null($parcelas), function($query) use ($parcelas){
                $query->where('qtde_parcela','>=',$parcelas);
            })
            ->orderBy('qtde_parcela','ASC')
            ->first();

        return $coeficiente;

    }

    public function getHistoricoInssMargem($id,$parcelas=null){

        try {

            $data = DB::table('inss_historico_margem as IH')
                ->join('beneficios_cpf AS B','IH.id_beneficio','=','B.id')
                ->join('apis AS A','B.provider','=','A.id')
                ->selectRaw('IH.*, A.offline')
                ->where('IH.id_beneficio', $id)
                ->orderByRaw("CASE WHEN IH.tipo = 'online' THEN 1 ELSE 2 END")
                ->first();

            if(is_object($data)){
                $bestCommission = $this->getBestCommission();

                $coeficiente = $this->getBestTableCoefficient($bestCommission->id_tabela,$parcelas);
                $coeficiente = $coeficiente->coeficiente;

                $disponivelEmprestimo = number_format(($data->margem_disponivel_emprestimo - 0.10) / (is_numeric($coeficiente) ? $coeficiente : 1),2,'.','');
                $data->calc_margem_disponivel_emprestimo = $disponivelEmprestimo;

                $margemDisponivelCartao = number_format($data->margem_margem_disponivel_cartao * 27.5,2,'.','');
                $data->calc_margem_disponivel_cartao = $margemDisponivelCartao;

                $margemDisponivelCartaoSaque = number_format($data->calc_margem_disponivel_cartao * 0.7,2,'.','');
                $data->calc_saque_margem_disponivel_cartao = $margemDisponivelCartaoSaque;

                $margemDisponivelCartaoBeneficio = number_format($data->margem_disponivel_cartao_beneficio * 27.5,2,'.','');
                $data->calc_margem_disponivel_cartao_beneficio = $margemDisponivelCartaoBeneficio;

                $margemDisponivelCartaoBeneficioSaque = number_format($data->calc_margem_disponivel_cartao_beneficio * 0.7,2,'.','');
                $data->calc_saque_margem_disponivel_cartao_beneficio = $margemDisponivelCartaoBeneficioSaque;

                $totalDisponivel = $disponivelEmprestimo+$margemDisponivelCartao+$margemDisponivelCartaoBeneficio;
                $totalDisponivelSaque = $margemDisponivelCartaoSaque+$margemDisponivelCartaoBeneficioSaque;

                $data->valor_total_disponivel = $totalDisponivel;
                $data->valor_total_disponivel_saque = $totalDisponivelSaque;

                return response()->json(['data'=>$data,'status'=>'ok'], 200);
            }else{

                $data = (object)[];
                $data->calc_margem_disponivel_emprestimo = 0.00;
                $data->calc_margem_disponivel_cartao = 0.00;
                $data->calc_saque_margem_disponivel_cartao = 0.00;
                $data->calc_margem_disponivel_cartao_beneficio = 0.00;
                $data->calc_saque_margem_disponivel_cartao_beneficio = 0.00;
                $data->valor_total_disponivel = 0.00;
                $data->valor_total_disponivel_saque = 0.00;

                return response()->json(['data'=>$data,'status'=>'ok'], 200);
            }

        }catch (\Exception $e){
            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);
        }

    }

    public function getHistoricoInssBanco($id){

        try {

            $data = DB::table('inss_dados_bancarios as B')
                ->where('B.id_beneficio', $id)
                ->first();

            return response()->json(['data'=>$data,'status'=>'ok'], 200);

        }catch (\Exception $e){
            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);
        }

    }

    public function getHistoricoInssContratosEmprestimo($id){

        try {

            $data = DB::table('inss_historico_contratos_emprestimo as CE')
                ->where('CE.id_beneficio', $id)
                ->get();

            return response()->json(['data'=>$data,'status'=>'ok'], 200);

        }catch (\Exception $e){
            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);
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
        //
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

            $ficha = DB::table('inss_historico_margem as H')
                ->join('beneficios_cpf AS B','H.id_beneficio','=','B.id')
                ->selectRaw('H.*, B.nome, B.cpf, B.data_nascimento')
                ->where('H.id','=',$id)
                ->first();

            return response()->json($ficha, 200);

        }catch (\Exception $e){
            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);
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

}
