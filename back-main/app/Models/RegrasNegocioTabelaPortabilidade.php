<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegrasNegocioTabelaPortabilidade extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'id_banco', 'id_tabela', 'id_regra_negocio', 'valor', 'idade_de', 'idade_ate', 'prazo_de', 'prazo_ate', 'valor_de', 'valor_ate', 'data_inicio', 'data_fim', 'especies_permitidas', 'especies_bloqueadas', 'bancos_portados', 'bancos_nao_portados', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected $table = 'regras_negocio_tabela_portabilidade';

}
