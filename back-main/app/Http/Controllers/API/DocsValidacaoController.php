<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DocsValidacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DocsValidacaoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $validacao = DocsValidacao::get();

            return response()->json([
                'status' => 'success',
                'data' => $validacao
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao buscar as validações: ' . $e->getMessage(),
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
                $validator = Validator::make($request->all(), [
                    'id_beneficio' => 'required|numeric',
                    'id_cliente' => 'nullable|numeric',
                    'etapa' => 'nullable|numeric',
                    'status' => 'required|numeric',
                    'api_tipo_validacao' => 'nullable|string|max:45',
                    'api_id_requisicao' => 'nullable|string|max:45',
                    'api_codigo_status' => 'nullable|numeric',
                    'api_resposta_json' => 'nullable|string',
                    'api_tipo_documento' => 'nullable|string|max:45',
                    'api_subtipo_documento' => 'nullable|string|max:45',
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Os dados fornecidos são inválidos.',
                        'errors' => $validator->errors()
                    ], 400);
                }

                $validacao = DocsValidacao::create($request->all());

                return response()->json([
                    'status' => 'success',
                    'message' => 'A validação foi criada com sucesso.',
                    'data' => $validacao
                ], 201);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ocorreu um erro ao criar a validação: ' . $e->getMessage(),
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
    public function update(Request $request, DocsValidacao $validacao)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_beneficio' => 'required|numeric',
                'id_cliente' => 'required|numeric',
                'etapa' => 'nullable|numeric',
                'status' => 'required|numeric',
                'api_tipo_validacao' => 'nullable|string|max:45',
                'api_id_requisicao' => 'nullable|string|max:45',
                'api_codigo_status' => 'nullable|numeric',
                'api_resposta_json' => 'nullable|string',
                'api_tipo_documento' => 'nullable|string|max:45',
                'api_subtipo_documento' => 'nullable|string|max:45',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Os dados fornecidos são inválidos.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $validacao->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'A validação foi alterada com sucesso.',
                'data' => $validacao
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocorreu um erro ao alterar a validação: ' . $e->getMessage(),
            ], 500);
        }
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
