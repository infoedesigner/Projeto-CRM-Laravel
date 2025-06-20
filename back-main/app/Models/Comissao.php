<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comissao extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_user', 'id_banco', 'id_tabela', 'parcelas_inicio', 'parcelas_fim', 'percent_comissao', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'comissoes';

}
