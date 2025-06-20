<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FunctionsController;
use App\Models\ConsultaComDisponibilidade;
use App\Models\ConsultaCredito;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7;

class MercantilController extends Controller
{

    public $url;
    public $url_token;
    public $grant_type;
    public $client_id;
    public $client_secret;
    public $cpf;
    public $user_id;

    public function __construct($cpf,$user_id)
    {
        $this->url_token = 'https://api.mercantil.com.br:8443/auth/oauth/v2/token';
        $this->url = 'https://api.mercantil.com.br:8443/';

        $this->grant_type = 'client_credentials';
        $this->client_id = 'l73d73ce1be0794a5a85130d5b4c4ff2e4';
        $this->client_secret = '120f03f4d89d40aaab832c6ce335bb13';
        $this->cpf = $cpf;
        $this->user_id = $user_id;
    }

    public function token(){

        try {

            $client = new Client(['verify' => false]);
            $headers = [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ];
            $request = new Request('POST', $this->url_token, $headers);

            $options = [
                'form_params' => [
                    'grant_type' => $this->grant_type,
                    'client_id' => $this->client_id,
                    'client_secret' => $this->client_secret,
                ]
            ];
            $response = $client->sendAsync($request, $options)->wait();
            $result = json_decode($response->getBody());

            return $result->access_token;

        }catch (\Exception $e){
            \Log::error('Erro ao gerar token '.$e->getMessage());
            return false;
        }

    }

    public function getBeneficiosByCPF(){

        try {

            $userId = $this->user_id;
            $CPF = FunctionsController::onlyNumbers($this->cpf);

            $client = new Client(['verify' => false]);
            $token = $this->token();
            $headers = [
                'Authorization' => 'Bearer '.$token,
            ];
            $request = new Request("GET", $this->url.'PropostasExternas/v1/Clientes/'.$CPF.'/SaquesAniversario/Saldo', $headers);
            $response = $client->sendAsync($request)->wait();

            if($response->getStatusCode()===404 || $response->getStatusCode()===400 || $response->getStatusCode()===500){
                $add = ConsultaCredito::create([
                    'cpf' => $CPF,
                    'provider' => 3,
                    'user_id' => $userId,
                    'json_response' => $response->getBody()->getContents(),
                    'code_response' => $response->getStatusCode()
                ]);
                $retorno = json_decode($response->getBody());

                return json_encode(['status'=>'error','data'=>$retorno->errors[0]->message,'code'=>$response->getStatusCode()]);
            }

            if($response->getStatusCode()===200){
                $add = ConsultaCredito::create([
                    'cpf' => $CPF,
                    'provider' => 3,
                    'user_id' => $userId,
                    'json_response' => $response->getBody()->getContents(),
                    'code_response' => $response->getStatusCode()
                ]);
                $retorno = json_decode($response->getBody());

                return json_encode(['status'=>'ok','data'=>$retorno,'code'=>$response->getStatusCode()]);
            }

        } catch (\Exception $e) {
            return json_encode(['status'=> 'error', 'message' => $e->getMessage(),'code'=>400]);
        }

    }

}
