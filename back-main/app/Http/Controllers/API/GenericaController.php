<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FunctionsController;
use App\Models\ConsultaComDisponibilidade;
use App\Models\ConsultaCredito;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;

class GenericaController extends Controller
{

    public $url;
    public $usuario;
    public $senha;
    public $nb;
    public $user_id;

    public function __construct($nb,$user_id)
    {
        $this->url = 'http://62.171.164.177:8080/api-consulta-extrato';

        $this->usuario = '647';
        $this->senha = 'carrera41';
        $this->nb = $nb;
        $this->user_id = $user_id;
    }

    public function consultaExtrato(){

        try {

            $client = new Client(['verify' => false]);

            $request = $client->get($this->url."?usuario=".$this->usuario."&senha=".$this->senha."&nb=".$this->nb."&formato=json", [
                'debug' => false,
                'http_errors' => false,
                'headers' => [
                    'Content-type' => 'application/json',
                ]
            ]);

            $userId = $this->user_id;

            if($request->getStatusCode()===404){
                $add = ConsultaCredito::create([
                    'cpf' => $this->nb,
                    'provider' => 4,
                    'user_id' => $userId,
                    'json_response' => $request->getBody(),
                    'code_response' => $request->getStatusCode()
                ]);
            }

            if($request->getStatusCode()===200){
                $add = ConsultaCredito::create([
                    'nb' => $this->nb,
                    'provider' => 4,
                    'user_id' => $userId,
                    'json_response' => $request->getBody(),
                    'code_response' => $request->getStatusCode()
                ]);
            }

            if($request->getStatusCode()===400){
                $add = ConsultaCredito::create([
                    'nb' => $this->nb,
                    'provider' => 4,
                    'user_id' => $userId,
                    'json_response' => $request->getBody(),
                    'code_response' => $request->getStatusCode()
                ]);
            }

            return true;

        }catch (\Exception $e){
            \Log::error('Erro ao criar o retorno da API Genérica '.$e->getMessage());
            return false;
        }

    }

}
