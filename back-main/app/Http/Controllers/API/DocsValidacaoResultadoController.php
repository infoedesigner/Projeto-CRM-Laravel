<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DocsValidacaoResultado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DocsValidacaoResultadoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
            $validator = Validator::make($request->all(), [
                'id_docs' => 'required|integer',
                'api_campo_nome' => 'nullable|string|max:45',
                'api_campo_nome_padrao' => 'nullable|string|max:45',
                'api_campo_valor' => 'nullable|string|max:255',
                'api_campo_score' => 'nullable|numeric|between:0,1.00',
                'api_global_score' => 'nullable|numeric|between:0,1.00',
                'api_movimento_score' => 'nullable|numeric|between:0,1.00',
                'api_prova_vida_score' => 'nullable|numeric|between:0,1.00',
                'api_imagem_score' => 'nullable|numeric|between:0,1.00',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Os dados fornecidos são inválidos.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $validacao = DocsValidacaoResultado::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'O resultado da validação foi criada com sucesso.',
                'data' => $validacao
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar o resultado da validação: ' . $e->getMessage(),
            ], 500);
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
