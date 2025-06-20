<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BotControleCiclo extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'numero', 'data_hora_envio', 'message_return', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected $table = 'bot_controle_ciclo24';

}
