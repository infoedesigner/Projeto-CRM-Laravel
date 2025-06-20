<?php

namespace App\Http\Controllers\API;

use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class WhatsAppMessagesController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        try {

            $contatos = DB::table('whats_api_contatos AS C')->get();

            $data = [];
            foreach ($contatos as $contato){
                $messages = $this->messagesByWaId($contato->wa_id);
                $data[] = ['id'=>$contato->id, 'contato'=>$contato->name,'from_id'=>$contato->wa_id,'messages'=>$messages,'created_at'=>$contato->created_at];
            }

            return response()->json($data,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function messagesByWaId($id){

        $mensagens = DB::table('whats_api_messages AS M')
            ->where('M.from_id','=',$id)
            ->get();

        return $mensagens;

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
