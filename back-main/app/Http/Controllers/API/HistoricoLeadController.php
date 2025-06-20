<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\HistoricoContatosLead;
use App\Models\Lead;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HistoricoLeadController extends Controller
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

            Lead::where('id','=',$request->id_lead)->update(['status'=>2]);

            $add = HistoricoContatosLead::create([
                'id_lead' => $request->id_lead,
                'user_id' => $request->user()->id,
                'tipo_contato' => $request->tipo_contato,
                'descricao' => $request->descricao,
            ]);

            if(isset($request->data_contato) && isset($request->hora_contato)){

                $data_contato = Carbon::parse($request->data_contato)->format('Y-m-d');
                $hora_contato = Carbon::parse($request->hora_contato)->format('H:i:s');

                $add = Agenda::create([
                    'id_lead' => $request->id_lead,
                    'user_id' => $request->user()->id,
                    'data_retorno' => $data_contato.' '.$hora_contato
                ]);
            }

        }catch (\Exception $e){
            \Log::critical($e->getMessage());
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
