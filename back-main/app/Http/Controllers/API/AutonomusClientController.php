<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\ConsultaCredito;
use App\Models\INSSHistoryMargem;
use Illuminate\Http\Request;

class AutonomusClientController extends Controller
{

    public function updateClient(){

        try {

            $itens = Cliente::whereNull('status')->get();

            foreach ($itens as $item){

                $cc = ConsultaCredito::where('cpf','=',$item->cpf)->orderBy('created_at','DESC')->first();

                if(is_object($cc)){
                    if(!is_null($cc->json_response)){

                        $dados = json_decode($cc->json_response);

                        if(is_object($dados)){
                            Cliente::where('cpf','=',$item->cpf)->whereNull('data_nascimento')->update(['data_nascimento'=>$dados->dataNascimento]);
                        }

                    }
                }

            }

        }catch (\Exception $e){

        }

    }

}
