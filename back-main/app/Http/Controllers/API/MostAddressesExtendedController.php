<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MostAddressesExtended;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MostAddressesExtendedController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $all = MostAddressesExtended::get();

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

            $addressesExtended = $input[0];
            
            if(!isset($addressesExtended->data) ){
                $data = [
                    'most_enrichment_id' => $addressesExtended->most_enrichment_id,
                    'status' => $addressesExtended->status,
                    'errors' => count($addressesExtended->errors) > 0 ? json_encode($addressesExtended->errors) : null,                    
                ];

                $add = MostAddressesExtended::create($data);

                return response()->json(['message'=>'Sem registros.','status'=>'doing', 'id' => 0],200);
            }

            
            $addressesData = $addressesExtended->data[0];
            $addressesInfo = $addressesData->extendedAddresses;
            $addresses = $addressesInfo->addresses;

            $incluidos = [];

            foreach($addresses as $address){

                $data = [
                    'most_enrichment_id' => $addressesExtended->most_enrichment_id,
                    'status' => $addressesExtended->status,
                    'errors' => count($addressesExtended->errors) > 0 ? json_encode($addressesExtended->errors) : null,                    
                    'typology' => $address->typology,
                    'title' => $address->title,
                    'addressMain' => $address->addressMain,
                    'number' => $address->number,
                    'complement' => $address->complement,
                    'neighborhood' => $address->neighborhood,
                    'zipCode' => $address->zipCode,
                    'city' => $address->city,
                    'state' => $address->state,
                    'country' => $address->country,
                    'type' => $address->type,
                    'addressCurrentlyInRFSite' => $address->addressCurrentlyInRFSite,
                    'complementType' => $address->complementType,
                    'buildCode' => $address->buildCode,
                    'buildingCode' => $address->buildingCode,
                    'householdCode' => $address->householdCode,
                    'addressEntityAge' => $address->addressEntityAge,
                    'addressEntityTotalPassages' => $address->addressEntityTotalPassages,
                    'addressEntityBadPassages' => $address->addressEntityBadPassages,
                    'addressEntityCrawlingPassages' => $address->addressEntityCrawlingPassages,
                    'addressEntityValidationPassages' => $address->addressEntityValidationPassages,
                    'addressEntityQueryPassages' => $address->addressEntityQueryPassages,
                    'addressEntityMonthAveragePassages' => $address->addressEntityMonthAveragePassages,
                    'addressGlobalAge' => $address->addressGlobalAge,
                    'addressGlobalTotalPassages' => $address->addressGlobalTotalPassages,
                    'addressGlobalBadPassages' => $address->addressGlobalBadPassages,
                    'addressGlobalCrawlingPassages' => $address->addressGlobalCrawlingPassages,
                    'addressGlobalValidationPassages' => $address->addressGlobalValidationPassages,
                    'addressGlobalQueryPassages' => $address->addressGlobalQueryPassages,
                    'addressGlobalMonthAveragePassages' => $address->addressGlobalMonthAveragePassages,
                    'addressNumberOfEntities' => $address->addressNumberOfEntities,
                    'priority' => $address->priority,
                    'isMainForEntity' => $address->isMainForEntity,
                    'isRecentForEntity' => $address->isRecentForEntity,
                    'isMainForOtherEntity' => $address->isMainForOtherEntity,
                    'isRecentForOtherEntity' => $address->isRecentForOtherEntity,
                    'isActive' => $address->isActive,
                    'isRatified' => $address->isRatified,
                    'isLikelyFromAccountant' => $address->isLikelyFromAccountant,
                    'lastValidationDate' => $address->lastValidationDate,
                    'entityFirstPassageDate' => $address->entityFirstPassageDate,
                    'entityLastPassageDate' => $address->entityLastPassageDate,
                    'globalFirstPassageDate' => $address->globalFirstPassageDate,
                    'globalLastPassageDate' => $address->globalLastPassageDate,
                    'creationDate' => $address->creationDate,
                    'lastUpdateDate' => $address->lastUpdateDate,
                    'hasOptIn' => $address->hasOptIn,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude
                ];

                $add = MostAddressesExtended::create($data);

                $incluidos[] = $add->id;
            }
    
            return response()->json(['message'=>'Cadastro realizado com sucesso.','status'=>'success', 'id' => $incluidos],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MostAddressesExtended  $mostAddressesExtended
     * @return \Illuminate\Http\Response
     */
    public function show(MostAddressesExtended $mostAddressesExtended)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MostAddressesExtended  $mostAddressesExtended
     * @return \Illuminate\Http\Response
     */
    public function edit(MostAddressesExtended $mostAddressesExtended)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MostAddressesExtended  $mostAddressesExtended
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MostAddressesExtended $mostAddressesExtended)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MostAddressesExtended  $mostAddressesExtended
     * @return \Illuminate\Http\Response
     */
    public function destroy(MostAddressesExtended $mostAddressesExtended)
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
            
            $data = DB::table('most_addresses_extended AS A')
                    ->join('most_enrichment AS ME', 'ME.id', '=', 'A.most_enrichment_id')
                    ->select('A.*')
                    ->where('ME.id_beneficio', '=', $id_beneficio)
                    ->orderBy('A.id')
                    ->get();

            return response()->json($data ,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }      
}
