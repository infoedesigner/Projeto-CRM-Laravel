<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BotChat extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'pergunta', 'resposta', 'gatilho_hardcode', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'botchat';

}
