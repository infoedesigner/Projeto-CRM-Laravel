<?php

namespace App\Http\Controllers;

use App\Models\BotChat;
use BotMan\BotMan\BotMan;
use Illuminate\Http\Request;
use BotMan\BotMan\Messages\Incoming\Answer;

class BotManController extends Controller
{
    /**
     * Place your BotMan logic here.
     */
    public function handle()
    {
        $botman = app('botman');

        $botman->hears('{message}', function ($botman, $message) {

            if ($message == 'oi') {
                $this->askName($botman);
            } else{
                $checkTrigger = $this->checkTrigger($message);

                $botman->reply("🥹 Ops, não entendi... pode perguntar de uma maneira diferente?");
            }
        });

        $botman->listen();
    }

    public function checkTrigger($sentenca){

        $check = BotChat::where()->count();

    }

    /**
     * Place your BotMan logic here.
     */
    public function askName($botman)
    {
        $botman->ask('Tudo bem? Qual seu nome?', function (Answer $answer) {

            $name = $answer->getText();

            $this->say('Prazer ' . $name. ', o meu é Carrera Carneiro BOT, se preferir, carneirinho.');
        });
    }
}
