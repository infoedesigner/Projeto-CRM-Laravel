<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BotControleCiclo;
use App\Models\WhatsApiContatos;
use App\Models\WhatsApiMessages;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Positus\Client;

class WhatsAppController extends Controller
{

    public function checkContactById($id){
        $contact = WhatsApiContatos::where('wa_id', '=', $id)->count();
        return $contact > 0 ? true : false;
    }

    public function sendMessage($numberTo,$message){

        $client = new Client();
        $client->setToken(env('POSITUS_API_TOKEN'));
        $number = $client->number('c8b69db4-26e7-4378-8d0f-9ea775ca174f');

        $check = BotControleCiclo::where('numero','=',$numberTo)->orderBy('id','DESC')->first();

        if(!is_object($check)){
            $this->novoCiclo24hrs($numberTo);
            sleep(1);
        }else{
            $now = Carbon::now();
            $ultimo_envio = Carbon::parse($check->data_hora_envio);

            if($now > $ultimo_envio){
                $this->novoCiclo24hrs($numberTo);
                sleep(1);
            }

        }

        $response = $number->sendData([
            'to' => '+' . $numberTo,
            'type' => 'text',
            'text' => [
                'body' => $message
            ]
        ]);

        $body = $response->json();

        \Log::critical(json_encode($body));

    }

    public function incomingMessages(Request $request){

        try {

            $all = $request->all();
            $numberTo = null;
            $name = null;

            if (array_key_exists("contacts", $all)) {

                $contacts = $all['contacts'];

                foreach ($contacts as $contact) {

                    $numberTo = $contact['wa_id'];
                    $name = $contact['profile']['name'];

                    $client = new Client();
                    $client->setToken(env('POSITUS_API_TOKEN'));
                    $number = $client->number('c8b69db4-26e7-4378-8d0f-9ea775ca174f');

                    $response = $number->sendData([
                        'to' => '+' . $numberTo,
                        'type' => 'text',
                        'text' => [
                            'body' => 'Olá, nosso número principal mudou para 41 21186622 .Obrigado pelo seu contato.'
                        ]
                    ]);

                    $body = $response->json();

                    \Log::info($body);

                    if (!$this->checkContactById($contact['wa_id'])) {
                        WhatsApiContatos::create([
                            'name' => $contact['profile']['name'],
                            'wa_id' => $contact['wa_id']
                        ]);
                    }

                    if (array_key_exists("messages", $all)) {

                        $messages = $all['messages'];

                        foreach ($messages as $message) {

                            if ($message['type'] == 'text') { // verificar se não existe sessão para conversa...

                                $add = WhatsApiMessages::create([
                                    'to_id' => $contact['wa_id'],
                                    'from_id' => $message['from'],
                                    'message_id' => $message['id'],
                                    'message_date' => Carbon::createFromTimestamp($message['timestamp'])->toDateTimeString(),
                                    'type' => $message['type'],
                                    'body' => $message['text']['body']
                                ]);

                            }

                        }

                    }

                }

            }

        } catch (\Exception $e) {
            \Log::critical($e->getMessage());
        }

    }

    public function novoCiclo24hrs($numberTo){

        try {

            $client = new Client();
            $client->setToken(env('POSITUS_API_TOKEN'));
            $number = $client->number('c8b69db4-26e7-4378-8d0f-9ea775ca174f');

            //verifica se é primeira do ciclo 24 hrs, se sim, envia um template de início ciclo
            $hsm = $number->sendData([
                'to' => '+' . $numberTo,
                'type' => 'template',
                'template' => [
                    'namespace' => '4ec1f211_4efe_4905_9422_15f986a1bea9',
                    'name' => 'envio_de_documentos',
                    'language' => [
                        'policy' => 'deterministic',
                        'code' => 'pt_BR'
                    ],
                    'localizable_params' => [
                        'default' => 'CCEF'
                    ]
                ]
            ]);

            $body_hsm = $hsm->json();

            $now = Carbon::now();
            $cicloEnd = $now->addHours(24);

            $add = BotControleCiclo::create([
                'numero' => $numberTo,
                'data_hora_envio' => $cicloEnd,
                'message_return' => json_encode($body_hsm),
            ]);

        }catch (\Exception $e){
            dd($e->getMessage());
        }

    }


}
