<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MostEnrichment;
use Illuminate\Http\Request;

class MostEnrichmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $all = MostEnrichment::get();

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

            $data = $request->all();
            $add = MostEnrichment::create($data);

            return response()->json(['message'=>'Cadastro realizado com sucesso.','status'=>'success', 'id' => $add->id],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MostEnrichment  $mostEnrichment
     * @return \Illuminate\Http\Response
     */
    public function show(MostEnrichment $mostEnrichment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MostEnrichment  $mostEnrichment
     * @return \Illuminate\Http\Response
     */
    public function edit(MostEnrichment $mostEnrichment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MostEnrichment  $mostEnrichment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MostEnrichment $mostEnrichment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MostEnrichment  $mostEnrichment
     * @return \Illuminate\Http\Response
     */
    public function destroy(MostEnrichment $mostEnrichment)
    {
        //
    }
}
