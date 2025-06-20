<?php

namespace App\Http\Controllers\API;

use DB;
use App\Http\Controllers\Controller;
use App\Models\Comissao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ComissaoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        try {
            $comissoes = DB::table('comissoes AS C')
                ->leftJoin('banco AS B','C.id_banco','=','B.id')
                ->leftJoin('tabela AS TB','C.id_tabela','=','TB.id')
                ->selectRaw('C.*, B.nome_banco, TB.nome as tabela')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $comissoes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao buscar as comissões: ' . $e->getMessage(),
            ], 500);
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

        $data = $request->all();
        //$data['id_user'] = $request->user()->id;

        try {
            // Validar as entradas do usuário
            $validator = Validator::make($data, [
                'id_banco' => 'required',
                'id_tabela' => 'required',
                'parcelas_inicio' => 'required',
                'parcelas_fim' => 'required',
                'percent_comissao' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Os dados fornecidos são inválidos.',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Criar uma nova Comissao
            $comissao = Comissao::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'A comissão foi criada com sucesso.',
                'data' => $comissao
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar a comissão: ' . $e->getMessage(),
            ], 500);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comissao  $comissao
     * @return \Illuminate\Http\Response
     */
    public function show(Comissao $comissao)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comissao  $comissao
     * @return \Illuminate\Http\Response
     */
    public function edit(Comissao $comissao)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comissao  $comissao
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comissao $comissao)
    {

        try {
            // Validar as entradas do usuário
            $validator = Validator::make($request->all(), [
                'id_user' => 'integer',
                'id_banco' => 'integer',
                'id_tabela' => 'integer',
                'parcelas_inicio' => 'integer',
                'parcelas_fim' => 'integer',
                'percent_comissao' => 'numeric',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Os dados fornecidos são inválidos.',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Atualizar os campos da Comissao com base nos dados do usuário
            $comissao->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'A comissão foi atualizada com sucesso.',
                'data' => $comissao
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao atualizar a comissão: ' . $e->getMessage(),
            ], 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comissao  $comissao
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comissao $comissao)
    {

        try {
            $comissao->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'A comissão foi excluída com sucesso.',
            ], 200);

        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao atualizar a comissão: ' . $e->getMessage(),
            ], 500);
        }

    }

}
