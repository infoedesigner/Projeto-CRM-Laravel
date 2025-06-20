<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocsValidacaoResultado extends Model
{
    use HasFactory;
    
    protected $fillable = ['id','id_docs_validacao','id_docs','api_campo_nome','api_campo_nome_padrao','api_campo_valor','api_campo_score','api_global_score','api_movimento_score','api_prova_vida_score','api_imagem_score','created_at','updated_at','deleted_at'];

    protected $table = 'docs_validacao_resultado';
}
