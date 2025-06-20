<?php

namespace App\Http\Controllers\API;

use DB;
use App\Http\Controllers\Controller;

class LeadsKPIsController extends BaseController
{

    public function leadsByStatus($dataInicio=null,$dataFim=null){

        try{

            $data = DB::table('lead')
                ->selectRaw('COUNT(*) as total, status')
                ->get();

            return $this->sendResponse($data, 'Sucesso');

        }catch (\Exception $e){
            return $this->sendError($e->getMessage());
        }

    }

}
