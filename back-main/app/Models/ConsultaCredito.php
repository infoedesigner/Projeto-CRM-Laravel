<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultaCredito extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'user_id', 'lead_id', 'cpf', 'json_response', 'nb', 'provider', 'nome', 'data_nascimento', 'code_response', 'uuid', 'status', 'tentativa', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'consulta_credito';

}
