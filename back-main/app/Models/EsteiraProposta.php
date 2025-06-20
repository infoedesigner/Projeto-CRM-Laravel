<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EsteiraProposta extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'user_id', 'id_produto', 'id_banco', 'id_cliente', 'id_coeficiente', 'id_tabela', 'id_beneficio_cpf', 'id_lead', 'coeficiente', 'data_abertura', 'n_proposta', 'beneficio', 'valor_margem', 'valor_total_com_juros', 'valor_liberado', 'data_coeficiente', 'n_contrato', 'parcelas', 'margem_disponivel', 'valor_comissao', 'valor_parcela', 'status', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'esteira_propostas';

}
