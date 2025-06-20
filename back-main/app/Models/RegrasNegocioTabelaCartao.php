<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegrasNegocioTabelaCartao extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'id_banco', 'id_tabela', 'id_regra_negocio', 'tipo', 'valor', 'idade_de', 'idade_ate', 'prazo_de', 'prazo_ate', 'valor_de', 'valor_ate', 'especies_bloqueadas', 'especies_permitidas', 'data_inicio', 'data_fim', 'fator', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected $table = 'regras_negocio_tabela_cartoes';

}
