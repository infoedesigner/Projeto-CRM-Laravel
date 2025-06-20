<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParcelasFGTS extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_consulta_credito', 'codigo_tabela_financiamento','descricao_tabela_financiamento','codigo_produto','descricao_produto','taxa_cet_mensal','cpf', 'uuid', 'prazo', 'num_parcela', 'valor_parcela', 'data_vencimento', 'valor_bruto', 'valor_cliente', 'valor_liquido', 'valor_iof', 'tipo_simulacao', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'fgts_parcelas';

}
