<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SimulacoesRealizadas extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_beneficio', 'id_tabela', 'params','validacao','simulacoes'];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    protected $table = 'simulacoes_realizadas';

}
