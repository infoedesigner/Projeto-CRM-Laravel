<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SimulacoesDisponiveis extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_beneficio', 'beneficio', 'cpf', 'credito_margem', 'credito_refin_portabilidade', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'simulacoes_disponiveis';

}
