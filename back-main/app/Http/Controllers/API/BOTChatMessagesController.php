<?php

namespace App\Http\Controllers\API;

use App\Models\BotChat;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class BOTChatMessagesController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        try {

            $botchat = BotChat::all();

            return response()->json($botchat,200);

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

            // Validar as entradas do usuário
            $validator = Validator::make($request->all(), [
                'pergunta' => 'required',
                'resposta' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Os dados fornecidos são inválidos.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $botchat = new BotChat();
            $botchat->fill($request->all());
            $botchat->save();

            return response()->json($botchat);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
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

        try {

            $botchat = BotChat::findOrFail($id);
            return response()->json($botchat);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
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

        try {

            // Validar as entradas do usuário
            $validator = Validator::make($request->all(), [
                'pergunta' => 'required',
                'resposta' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Os dados fornecidos são inválidos.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $botchat = BotChat::findOrFail($id);
            $botchat->pergunta = $request->pergunta;
            $botchat->resposta = $request->resposta;
            $botchat->save();

            return response()->json($botchat);

        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>$e->getMessage()]);
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
