<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CondicoesCredito extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_consulta_credito', 'id_beneficio', 'uuid', 'prazo', 'descricao_tabela_financiamento', 'codigo_produto', 'descricao_produto', 'taxa_apropriacao_anual', 'taxa_apropriacao_mensal', 'taxa_cet_anual', 'taxa_cet_mensal', 'taxa_referencia_anual', 'taxa_referencia_mensal', 'valor_bruto', 'valor_cliente', 'valor_financiado', 'valor_solicitado', 'valor_iof', 'valor_liquido', 'tipo_simulacao', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'condicoes_credito';

}
