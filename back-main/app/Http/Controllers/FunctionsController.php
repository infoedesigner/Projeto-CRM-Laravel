<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class FunctionsController extends Controller
{
    private static function messageType($type){

        switch ($type){
            case 1 :
                return 'alerta';
            case 2 :
                return 'notificação';
        }
    }

    public static function onlyNumbers($var){
        return preg_replace( '/[^0-9]/', '', $var );
    }

    public static function toMoney($var){
        $valor = preg_replace("/[^0-9]/", "", $var);
        if(is_numeric($valor)) {
            return number_format($valor / 100, 2, '.', '');
        }else{
            return 0.00;
        }
    }

    public static function toMoneyAll($var){
        $valor = preg_replace("/[^0-9\-]/", "", $var);
        if(is_numeric($valor)) {
            return number_format($valor / 100, 2, '.', '');
        }else{
            return 0.00;
        }
    }

    public static function toCurrency($var){
        if(is_numeric($var)) {
            return number_format($var , 2, '.', '');
        }else{
            return '0,00';
        }
    }

    public static function convertToHoursMins($time, $format = '%02d:%02d') {
        if ($time < 1) {
            return;
        }
        $hours = floor($time / 60);
        $minutes = ($time % 60);
        return sprintf($format, $hours, $minutes);
    }

    private static function timeStampType($type){
        switch ($type){
            case 1 :
                return 'Acidente';
            case 2 :
                return 'Obras';
            case 3 :
                return 'Sinistro';
            default :
                return 'Transito intenso';
        }
    }
}




