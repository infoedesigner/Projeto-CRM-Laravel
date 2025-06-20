<?php

namespace App\Http\Controllers\API;

use App\Models\RegrasNegocioTabela;
use DB;
use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        try {

            $all = DB::table('produto AS C')
                ->orderBy('produto','ASC')
                ->get();

            return response()->json($all,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
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

            $all = DB::table('produto AS P')->get();

            return response()->json($all,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function addRegraTabela(Request $request){

        try {

            RegrasNegocioTabela::create([
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
                'especies_permitidas' => $request->especies_permitidas
            ]);

            return response()->json(['status'=>'ok','message'=>'Regra adicionada com sucesso.']);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
        }

    }

    public function listRegrasTabela($id_tabela){

        try {

            $data = DB::table('regras_negocio_tabela AS RP')
                ->join('banco AS B','RP.id_banco','=','B.id')
                ->join('tabela AS T','RP.id_tabela','=','T.id')
                ->join('regras_negocio AS R','RP.id_regra_negocio','=','R.id')
                ->selectRaw('RP.*, T.nome, R.regra, B.nome_banco, R.tipo')
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

            DB::table('regras_negocio_tabela')
                ->where('id','=',$id_regra_produto)
                ->delete();

            return response()->json(['status'=>'ok','message'=>'Regra apagada com sucesso.']);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
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
        //
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
