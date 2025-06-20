<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Utils\Constants;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SegmentacaoController extends Controller
{

    public function checkIdade($dataNascimento,$produto){

        $dataNascimento = Carbon::createFromFormat('Y-m-d', $dataNascimento);
        $idade = $dataNascimento->diffInYears(Carbon::now());

        switch($produto){
            case 'INSS' : {
                if ($idade > Constants::MAX_IDADE) {
                    return false;
                }
            }
            case 'FGTS' : {
                if ($idade > Constants::MAX_IDADE_FGTS) {
                    return false;
                }
            }
            default : {
                return true;
            }
        }

    }

}
