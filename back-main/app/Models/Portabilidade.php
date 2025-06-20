<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portabilidade extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_banco', 'nome_tabela', 'tipo', 'prazo_inicio', 'prazo_fim', 'idade_min', 'idade_max', 'seguro', 'coeficiente', 'taxa_juros_minima', 'status', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'portabilidade';

}
