<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beneficios extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'cc_id', 'provider', 'uuid', 'cpf', 'beneficio', 'nome', 'data_nascimento', 'dib', 'especie', 'descricao_especie', 'situacao', 'check_contratos', 'check_credito', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'beneficios_cpf';

}
