<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\FunctionsController;
use App\Models\Beneficios;
use App\Models\EsteiraProposta;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CondicoesCreditoController extends Controller
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

            $data = DB::table('beneficios_cpf as B')
                ->join('consulta_credito AS CC','B.cc_id','=','CC.id')
                ->join('users AS U','CC.user_id','=','U.id')
                ->join('apis AS API','CC.provider','=','API.id')
                ->selectRaw('B.*, U.name as colaborador, API.api_name')
                ->when(!is_null($key),function($query) use ($key){
                    $query->where('B.nome','LIKE','%'.$key.'%')
                          ->orWhere('B.cpf','LIKE','%'.$key.'%');
                })
                ->get();

            return response()->json(['data'=>$data,'status'=>'ok'], 200);

        }catch (\Exception $e){
            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);
        }

    }

    public function getCondicoesCreditoParcelas($icc,$uuid){

        try {

            $data = DB::table('condicoes_credito_parcelas as CCP')
                ->selectRaw('CCP.*')
                ->where('CCP.id_consulta_credito', $icc)
                ->where('CCP.uuid', $uuid)
                ->get();

            return response()->json(['data'=>$data,'status'=>'ok'], 200);

        }catch (\Exception $e){
            return response()->json(['data' => $e->getMessage(),'status'=>'error'], 400);
        }

    }

    public function getCondicoesCredito($id){

        try {

            $data = DB::table('condicoes_credito as CC')
                ->selectRaw('CC.*')
                ->where('CC.id_beneficio', $id)
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
