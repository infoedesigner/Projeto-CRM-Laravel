<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'user_id', 'id_lead', 'data_retorno', 'descricao', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'agenda';

}
