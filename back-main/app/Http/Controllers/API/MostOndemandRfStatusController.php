<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MostOndemandRfStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MostOndemandRfStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $all = MostOndemandRfStatus::get();

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
            
            $input = $request->all();
            $ondemand = $input[0];

            if(!isset($ondemand->data) ){
                $data = [
                    'most_enrichment_id' => $ondemand->most_enrichment_id,
                    'status' => $ondemand->status,
                    'fromCache' => $ondemand->fromCache,
                    'errors' => count($ondemand->errors) > 0 ? json_encode($ondemand->errors) : null,
                ];
                        
                $add = MostOndemandRfStatus::create($data);

                return response()->json(['message'=>'Sem registros.','status'=>'doing', 'id' => 0],200);
            }

            $ondemandData = $ondemand->data[0];
            $onlineCertificates = $ondemandData->onlineCertificates[0];
            $additionalOutputData = $onlineCertificates->additionalOutputData;
                    
            $data = [
                'most_enrichment_id' => $ondemand->most_enrichment_id,
                'status' => $ondemand->status,
                'fromCache' => $ondemand->fromCache,
                'errors' => count($ondemand->errors) > 0 ? http_build_query($ondemand->errors) : null,
                'matchKeys' => $ondemandData->matchKeys,

                'origin' => $onlineCertificates->origin,
                'inputParameters' => $onlineCertificates->inputParameters,
                'protocolNumber' => $onlineCertificates->protocolNumber,
                'baseStatus' => $onlineCertificates->baseStatus,

                'name' => $additionalOutputData->name,
                'birthdate' => $additionalOutputData->birthdate,
                'queryTime' => $additionalOutputData->queryTime,
                'socialName' => $additionalOutputData->socialName,
                'digit' => $additionalOutputData->digit,
                'registrationDate' => $additionalOutputData->registrationDate,
                'isDead' => $additionalOutputData->isDead,
                'deathYear' => $additionalOutputData->deathYear,
                'rawResultFile' => $additionalOutputData->rawResultFile,
                'rawResultFileType' => $additionalOutputData->rawResultFileType,
            ];
                    
            $add = MostOndemandRfStatus::create($data);

            return response()->json(['message'=>'Cadastro realizado com sucesso.','status'=>'success', 'id' => $add->id],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage() . '(line '.$e->getline().')','status'=>'error'],400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MostOndemandRfStatus  $mostOndemandRfStatus
     * @return \Illuminate\Http\Response
     */
    public function show(MostOndemandRfStatus $mostOndemandRfStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MostOndemandRfStatus  $mostOndemandRfStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(MostOndemandRfStatus $mostOndemandRfStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MostOndemandRfStatus  $mostOndemandRfStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MostOndemandRfStatus $mostOndemandRfStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MostOndemandRfStatus  $mostOndemandRfStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(MostOndemandRfStatus $mostOndemandRfStatus)
    {
        //
    }

    /**
     * Get the last resource from storage.
     *
     * @param  \App\Models\MostBasicData  $mostBasicData
     * @return \Illuminate\Http\Response
     */
    public function getLastByBeneficio($id_beneficio)
    {
        try {
            
            $data = DB::table('most_ondemand_rf_status AS S')
                    ->join('most_enrichment AS ME', 'ME.id', '=', 'S.most_enrichment_id')
                    ->select('S.*')
                    ->where('ME.id_beneficio', '=', $id_beneficio)
                    ->orderBy('S.id','DESC')
                    ->first();

            return response()->json($data ,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }     
}
