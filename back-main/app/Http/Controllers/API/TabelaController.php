<?php

namespace App\Http\Controllers\API;

use App\Models\Banco;
use App\Models\Tabela;
use Carbon\Carbon;
use DB;
use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TabelaController extends Controller
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

            $all = DB::table('tabela AS T')
                ->leftJoin('banco AS B','T.id_banco','=','B.id')
                ->selectRaw('T.*, B.nome_banco, (SELECT COUNT(*) FROM coeficiente AS C WHERE C.id_tabela = T.id) AS coeficientes')
                ->when(!is_null($term),function($q) use ($term){
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

            $data = str_replace(',','',$request->data_cadastro);

            $add = Tabela::create([
                'id_banco' => $request->id_banco,
                'nome' => $request->nome,
                'comissao' => $request->comissao,
                'data_cadastro' => Carbon::createFromFormat('d/m/Y h:i:s',$data)->format('Y-m-d'),
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

        $dados = Tabela::findOrFail($id);

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
            'comissao' => 'required',
            'nome' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Os dados fornecidos são inválidos.',
                'errors' => $validator->errors()
            ], 400);
        }

        Tabela::where('id','=',$id)->update(['id_banco'=>$request->id_banco,'nome'=>$request->nome,'comissao'=>$request->comissao]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        Tabela::where('id','=',$id)->update(['status'=>0]);

        return response()->json(['status'=>'ok','message'=>'DELETE']);
    }
}
