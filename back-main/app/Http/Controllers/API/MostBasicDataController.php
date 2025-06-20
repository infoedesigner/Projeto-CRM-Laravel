<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MostBasicData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MostBasicDataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $all = MostBasicData::get();

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

            $enrichment =  $input[0];

            if(!isset($enrichment->data)){
                $data = [
                    'most_enrichment_id' => $enrichment->most_enrichment_id,
                    'status' => $enrichment->status,
                    'errors' => count($enrichment->errors) > 0 ? json_encode($enrichment->errors) : null,                    
                ];                

                $add = MostBasicData::create($data);

                return response()->json(['message'=>'Sem registros.','status'=>'doing', 'id' => 0],200);
            }

            $data = $enrichment->data[0];
            $basicData = $data->basicData;

            $data = [
                'most_enrichment_id' => $enrichment->most_enrichment_id,
                'status' => $enrichment->status,
                'fromCache' => $enrichment->fromCache,
                'errors' => count($enrichment->errors) > 0 ? http_build_query($enrichment->errors) : null,
                'matchKeys' => $data->matchKeys,
                'name' => $basicData->name,
                'commonName' => $basicData->aliases->commonName,
                'standardizedizedName' => $basicData->aliases->standardizedName,
                'gender' => $basicData->gender,
                'nameWordCount' => $basicData->nameWordCount,
                'numberOfFullNameNamesakes' => $basicData->numberOfFullNameNamesakes,
                'nameUniquenessScore' => $basicData->nameUniquenessScore,
                'firstNameUniquenessScore' => $basicData->firstNameUniquenessScore,
                'firstAndLastNameUniquenessScore' => $basicData->firstAndLastNameUniquenessScore,
                'birthDate' => $basicData->birthDate,
                'age' => $basicData->age,
                'zodiacSign' => $basicData->zodiacSign,
                'chineseSign' => $basicData->chineseSign ,
                'birthCountry' => $basicData->birthCountry,
                'motherName' => $basicData->motherName,
                'fatherName' => $basicData->fatherName,
                'maritalStatusData' => isset($basicData->maritalStatusData->maritalStatus) ? $basicData->maritalStatusData->maritalStatus : null,
                'taxIdStatus' => $basicData->taxIdStatus,
                'taxIdOrigin' => $basicData->taxIdOrigin,
                'taxIdFiscalRegion' => $basicData->taxIdFiscalRegion,
                'hasObitIndication' => $basicData->hasObitIndication,
                'taxIdStatusDate' => $basicData->taxIdStatusDate,
                'taxIdStatusRegistrationDate' => $basicData->taxIdStatusRegistrationDate,
                'creationDate' => $basicData->creationDate,
                'lastUpdateDate' => $basicData->lastUpdateDate
            ];
            
            $add = MostBasicData::create($data);

            return response()->json(['message'=>'Cadastro realizado com sucesso.','status'=>'success', 'id' => $add->id],200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MostBasicData  $mostBasicData
     * @return \Illuminate\Http\Response
     */
    public function show(MostBasicData $mostBasicData)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MostBasicData  $mostBasicData
     * @return \Illuminate\Http\Response
     */
    public function edit(MostBasicData $mostBasicData)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MostBasicData  $mostBasicData
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MostBasicData $mostBasicData)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MostBasicData  $mostBasicData
     * @return \Illuminate\Http\Response
     */
    public function destroy(MostBasicData $mostBasicData)
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
            
            $data = DB::table('most_basic_data AS BD')
                    ->join('most_enrichment AS ME', 'ME.id', '=', 'BD.most_enrichment_id')
                    ->select('BD.*')
                    ->where('ME.id_beneficio', '=', $id_beneficio)
                    ->orderBy('BD.id','DESC')
                    ->first();

            return response()->json($data ,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }
    }    


    public function getExample(){
        $data = 
        '{
            "result": {
                "processId": "d4fb4026-5d1a-4e41-af53-33a74d090026",
                "tier": "CARRERA_PF_01",
                "query": "CARRERA_PF_01",
                "status": "DONE",
                "parameters": {
                    "cpf": "02945777932"
                },
                "datasets": [
                    {
                        "name": "basic_data",
                        "code": "basic_data_people_862909",
                        "status": "DONE",
                        "fromCache": false,
                        "errors": [],
                        "data": [
                            {
                                "matchKeys": "doc{02945777932}",
                                "basicData": {
                                    "taxIdNumber": "02945777932",
                                    "taxIdCountry": "BRAZIL",
                                    "alternativeIdNumbers": {},
                                    "name": "ROBSON CARRERA CARNEIRO",
                                    "aliases": {
                                        "commonName": "ROBSON CARNEIRO",
                                        "standardizedName": "ROBSOM CARERA CARNEIRO"
                                    },
                                    "gender": "M",
                                    "nameWordCount": 3,
                                    "numberOfFullNameNamesakes": 1,
                                    "nameUniquenessScore": 1,
                                    "firstNameUniquenessScore": 0.001,
                                    "firstAndLastNameUniquenessScore": 0.00275482,
                                    "birthDate": "1981-05-02T00:00:00Z",
                                    "age": 43,
                                    "zodiacSign": "TOURO",
                                    "chineseSign": "Rooster",
                                    "birthCountry": "BRASILEIRO(A)",
                                    "motherName": "MARIA CANDELARIA CARRERA CARNEIRO",
                                    "fatherName": "JOAO BATISTA CARNEIRO",
                                    "maritalStatusData": {
                                        "maritalStatus": "CASADO(A)",
                                        "maritalStatusSource": "BDC - ECertidoesPR",
                                        "maritalStatusLastUpdateDate": "2020-05-17T00:00:00Z"
                                    },
                                    "taxIdStatus": "REGULAR",
                                    "taxIdOrigin": "RECEITA FEDERAL",
                                    "taxIdFiscalRegion": "PR-SC",
                                    "hasObitIndication": false,
                                    "taxIdStatusDate": "2024-08-01T00:00:00",
                                    "taxIdStatusRegistrationDate": "1998-02-20T00:00:00Z",
                                    "creationDate": "2016-08-23T00:00:00Z",
                                    "lastUpdateDate": "2024-08-01T00:00:00"
                                }
                            }
                        ]
                    },
                    {
                        "name": "ondemand_rf_status",
                        "code": "ondemand_rf_status_ondemand_862909",
                        "status": "DONE",
                        "fromCache": false,
                        "errors": [],
                        "data": [
                            {
                                "matchKeys": "doc{02945777932}",
                                "onlineCertificates": [
                                    {
                                        "origin": "Receita-Federal Status",
                                        "inputParameters": "doc{02945777932},",
                                        "protocolNumber": "020C.11E2.8746.F7A8",
                                        "baseStatus": "REGULAR",
                                        "additionalOutputData": {
                                            "name": "ROBSON CARRERA CARNEIRO",
                                            "birthdate": "1981-05-02",
                                            "queryTime": "22:47:03",
                                            "socialName": "",
                                            "digit": "00",
                                            "registrationDate": "1998-02-20",
                                            "isDead": "FALSE",
                                            "deathYear": "",
                                            "rawResultFile": "https://mostqiapi.com/big-data/enrichment/documents/4a1dd434-a06c-448b-902f-4b2f396b1b88_ondemand_rf_status_person_20240913.html",
                                            "rawResultFileType": "html"
                                        },
                                        "queryDate": "2024-09-12T00:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "addresses_extended",
                        "code": "addresses_extended_people_862909",
                        "status": "DONE",
                        "fromCache": false,
                        "errors": [],
                        "data": [
                            {
                                "matchKeys": "doc{02945777932}",
                                "extendedAddresses": {
                                    "totalAddresses": 4,
                                    "totalActiveAddresses": 1,
                                    "totalWorkAddresses": 1,
                                    "totalPersonalAddresses": 3,
                                    "totalUniqueAddresses": 2,
                                    "totalAddressPassages": 7,
                                    "totalBadAddressPassages": 2,
                                    "oldestAddressPassageDate": "2015-10-31T00:00:00Z",
                                    "newestAddressPassageDate": "2024-05-09T00:00:00Z",
                                    "addresses": [
                                        {
                                            "typology": "PC",
                                            "title": "",
                                            "addressMain": "RUI BARBOSA",
                                            "number": "827",
                                            "complement": "CJ 111 ANDAR 1 COND RUI BARBOSA CJ CMRL",
                                            "neighborhood": "CENTRO",
                                            "zipCode": "80010030",
                                            "city": "CURITIBA",
                                            "state": "PR",
                                            "country": "BRASIL",
                                            "type": "WORK",
                                            "addressCurrentlyInRFSite": false,
                                            "complementType": "",
                                            "buildCode": "02A7F3429E9269B627E56DDDCC691CA7545324278D9F93121184DAF511E6175E",
                                            "buildingCode": "02A7F3429E9269B627E56DDDCC691CA7545324278D9F93121184DAF511E6175E",
                                            "householdCode": "93FDB9D87CDFD714372FC11E100CD6E89E6525D5EB89147BB1C55E0818AE4FCD",
                                            "addressEntityAge": 110,
                                            "addressEntityTotalPassages": 2,
                                            "addressEntityBadPassages": 2,
                                            "addressEntityCrawlingPassages": 2,
                                            "addressEntityValidationPassages": 0,
                                            "addressEntityQueryPassages": -1,
                                            "addressEntityMonthAveragePassages": 0.55,
                                            "addressGlobalAge": 1470,
                                            "addressGlobalTotalPassages": 3,
                                            "addressGlobalBadPassages": 4,
                                            "addressGlobalCrawlingPassages": 3,
                                            "addressGlobalValidationPassages": 0,
                                            "addressGlobalQueryPassages": -1,
                                            "addressGlobalMonthAveragePassages": 0.06,
                                            "addressNumberOfEntities": 2,
                                            "priority": 1,
                                            "isMainForEntity": true,
                                            "isRecentForEntity": true,
                                            "isMainForOtherEntity": false,
                                            "isRecentForOtherEntity": true,
                                            "isActive": true,
                                            "isRatified": true,
                                            "isLikelyFromAccountant": false,
                                            "lastValidationDate": "0001-01-01T00:00:00",
                                            "entityFirstPassageDate": "2024-01-20T00:00:00Z",
                                            "entityLastPassageDate": "2024-05-09T00:00:00Z",
                                            "globalFirstPassageDate": "2020-04-30T00:00:00Z",
                                            "globalLastPassageDate": "2024-05-09T00:00:00Z",
                                            "creationDate": "2024-01-20T00:00:00Z",
                                            "lastUpdateDate": "2024-05-09T00:00:00Z",
                                            "hasOptIn": false,
                                            "latitude": -25.43521,
                                            "longitude": -49.2739
                                        },
                                        {
                                            "typology": "R",
                                            "title": "",
                                            "addressMain": "BRASILIO CUMAN",
                                            "number": "1101",
                                            "complement": "",
                                            "neighborhood": "SAO BRAZ",
                                            "zipCode": "82315412",
                                            "city": "CURITIBA",
                                            "state": "PR",
                                            "country": "BRASIL",
                                            "type": "HOME",
                                            "addressCurrentlyInRFSite": false,
                                            "complementType": "",
                                            "buildCode": "70048C7D28836884D8D5D751448AE8BB28319B39EF9F0C00456CA2E7D9E5DE51",
                                            "buildingCode": "70048C7D28836884D8D5D751448AE8BB28319B39EF9F0C00456CA2E7D9E5DE51",
                                            "householdCode": "70048C7D28836884D8D5D751448AE8BB28319B39EF9F0C00456CA2E7D9E5DE51",
                                            "addressEntityAge": 1085,
                                            "addressEntityTotalPassages": 2,
                                            "addressEntityBadPassages": 0,
                                            "addressEntityCrawlingPassages": 2,
                                            "addressEntityValidationPassages": 0,
                                            "addressEntityQueryPassages": -1,
                                            "addressEntityMonthAveragePassages": 0.06,
                                            "addressGlobalAge": 1213,
                                            "addressGlobalTotalPassages": 4,
                                            "addressGlobalBadPassages": 0,
                                            "addressGlobalCrawlingPassages": 4,
                                            "addressGlobalValidationPassages": 0,
                                            "addressGlobalQueryPassages": -1,
                                            "addressGlobalMonthAveragePassages": 0.1,
                                            "addressNumberOfEntities": 2,
                                            "priority": 2,
                                            "isMainForEntity": false,
                                            "isRecentForEntity": false,
                                            "isMainForOtherEntity": false,
                                            "isRecentForOtherEntity": false,
                                            "isActive": false,
                                            "isRatified": false,
                                            "isLikelyFromAccountant": false,
                                            "lastValidationDate": "0001-01-01T00:00:00",
                                            "entityFirstPassageDate": "2015-10-31T00:00:00Z",
                                            "entityLastPassageDate": "2018-10-20T00:00:00Z",
                                            "globalFirstPassageDate": "2015-06-25T00:00:00Z",
                                            "globalLastPassageDate": "2018-10-20T00:00:00Z",
                                            "creationDate": "2015-10-31T00:00:00Z",
                                            "lastUpdateDate": "2018-10-20T00:00:00Z",
                                            "hasOptIn": false,
                                            "latitude": 0,
                                            "longitude": 0
                                        },
                                        {
                                            "typology": "R",
                                            "title": "MAL",
                                            "addressMain": "DEODORO",
                                            "number": "211",
                                            "complement": "CJ 1204 AN 10",
                                            "neighborhood": "CENTRO",
                                            "zipCode": "80020320",
                                            "city": "CURITIBA",
                                            "state": "PR",
                                            "country": "BRASIL",
                                            "type": "HOME",
                                            "addressCurrentlyInRFSite": false,
                                            "complementType": "",
                                            "buildCode": "D6A5D939BE8FE5CDD696FEFBEA8EB21BFA3C6668EF8DDB132549B10D2944B487",
                                            "buildingCode": "D6A5D939BE8FE5CDD696FEFBEA8EB21BFA3C6668EF8DDB132549B10D2944B487",
                                            "householdCode": "64D76031998B660B91A8C2412B321340F9A3966779EBD6D477E435F3A99AA577",
                                            "addressEntityAge": 1085,
                                            "addressEntityTotalPassages": 2,
                                            "addressEntityBadPassages": 0,
                                            "addressEntityCrawlingPassages": 2,
                                            "addressEntityValidationPassages": 0,
                                            "addressEntityQueryPassages": -1,
                                            "addressEntityMonthAveragePassages": 0.06,
                                            "addressGlobalAge": 1085,
                                            "addressGlobalTotalPassages": 2,
                                            "addressGlobalBadPassages": 0,
                                            "addressGlobalCrawlingPassages": 2,
                                            "addressGlobalValidationPassages": 0,
                                            "addressGlobalQueryPassages": -1,
                                            "addressGlobalMonthAveragePassages": 0.06,
                                            "addressNumberOfEntities": 1,
                                            "priority": 3,
                                            "isMainForEntity": false,
                                            "isRecentForEntity": false,
                                            "isMainForOtherEntity": false,
                                            "isRecentForOtherEntity": false,
                                            "isActive": false,
                                            "isRatified": false,
                                            "isLikelyFromAccountant": false,
                                            "lastValidationDate": "0001-01-01T00:00:00",
                                            "entityFirstPassageDate": "2015-10-31T00:00:00Z",
                                            "entityLastPassageDate": "2018-10-20T00:00:00Z",
                                            "globalFirstPassageDate": "2015-10-31T00:00:00Z",
                                            "globalLastPassageDate": "2018-10-20T00:00:00Z",
                                            "creationDate": "2015-10-31T00:00:00Z",
                                            "lastUpdateDate": "2018-10-20T00:00:00Z",
                                            "hasOptIn": false,
                                            "latitude": -25.431563,
                                            "longitude": -49.2703204
                                        },
                                        {
                                            "typology": "TV",
                                            "title": "",
                                            "addressMain": "NESTOR DE CASTRO",
                                            "number": "219",
                                            "complement": "AP 2003",
                                            "neighborhood": "CENTRO",
                                            "zipCode": "80020120",
                                            "city": "CURITIBA",
                                            "state": "PR",
                                            "country": "BRASIL",
                                            "type": "HOME",
                                            "addressCurrentlyInRFSite": false,
                                            "complementType": "APARTAMENT",
                                            "buildCode": "8AF4A9123E339DA5820836D94122127BDA09A5EC6E7800248C260A9A6B2277EE",
                                            "buildingCode": "8AF4A9123E339DA5820836D94122127BDA09A5EC6E7800248C260A9A6B2277EE",
                                            "householdCode": "4FE4F4E3DF5654FBAA369E3462B27DB8A2ADCE14562999F34EA09583A043A12C",
                                            "addressEntityAge": 1,
                                            "addressEntityTotalPassages": 1,
                                            "addressEntityBadPassages": 0,
                                            "addressEntityCrawlingPassages": 1,
                                            "addressEntityValidationPassages": 0,
                                            "addressEntityQueryPassages": -1,
                                            "addressEntityMonthAveragePassages": 1,
                                            "addressGlobalAge": 1,
                                            "addressGlobalTotalPassages": 1,
                                            "addressGlobalBadPassages": 0,
                                            "addressGlobalCrawlingPassages": 1,
                                            "addressGlobalValidationPassages": 0,
                                            "addressGlobalQueryPassages": -1,
                                            "addressGlobalMonthAveragePassages": 1,
                                            "addressNumberOfEntities": 1,
                                            "priority": 4,
                                            "isMainForEntity": false,
                                            "isRecentForEntity": false,
                                            "isMainForOtherEntity": false,
                                            "isRecentForOtherEntity": false,
                                            "isActive": false,
                                            "isRatified": true,
                                            "isLikelyFromAccountant": false,
                                            "lastValidationDate": "0001-01-01T00:00:00",
                                            "entityFirstPassageDate": "2015-10-31T00:00:00Z",
                                            "entityLastPassageDate": "2015-10-31T00:00:00Z",
                                            "globalFirstPassageDate": "2015-10-31T00:00:00Z",
                                            "globalLastPassageDate": "2015-10-31T00:00:00Z",
                                            "creationDate": "2015-10-31T00:00:00Z",
                                            "lastUpdateDate": "2018-10-20T00:00:00Z",
                                            "hasOptIn": false,
                                            "latitude": -25.42878,
                                            "longitude": -49.27335
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            "requestId": "YW67YVHJAc2BrQn63LxTz",
            "elapsedMilliseconds": 1210,
            "status": {
                "message": "Ok",
                "code": "200",
                "errors": null
            }
        }';
          
        return $data ;
    }

    public function getExampleAsync(){
        $data = 
        '{
            "result": {
                "processId": "6996d097-76f5-4718-b8ed-138153fe44bd"
            },
            "requestId": "x54FQa2UJn2rNeZ23hEyh",
            "elapsedMilliseconds": 728,
            "status": {
                "message": "Ok",
                "code": "200",
                "errors": null
            }
        }';

        return $data ;
    }
}
