<?php

namespace App\Handlers;

use App\Http\Controllers\API\AliveController;
use BeyondCode\LaravelWebSockets\Apps\App;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

class CCEFWebSocketHandler implements MessageComponentInterface
{

    public $alive;

    public function onOpen(ConnectionInterface $connection)
    {

        $socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        $connection->socketId = $socketId;
        $connection->app = App::findById('websocket');

        \Log::critical('Conexão aberta');

    }

    public function onClose(ConnectionInterface $connection)
    {


    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        // TODO: Implement onError() method.
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {

        try {

            $message = json_decode($msg);
            $message = $message->data;

            $add = $this->alive->createSession($message->uuid, $message->ramal, $message->filas, $message->ipServer, $message->message, $message->agent, $message->browser);

            \Log::critical($msg);

        }catch (\Exception $e){
            \Log::critical($e->getMessage());
        }

    }
}
