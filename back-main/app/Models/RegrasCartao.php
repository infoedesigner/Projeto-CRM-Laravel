<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegrasCartao extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_produto', 'nome_regra', 'tipo', 'minima_parcela', 'minimo_emprestimo', 'taxa_inicio', 'taxa_fim', 'bonus_posterior', 'percentual_repasse', 'idade_minima', 'idade_maxima', 'fator', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'regras_cartoes';

}
