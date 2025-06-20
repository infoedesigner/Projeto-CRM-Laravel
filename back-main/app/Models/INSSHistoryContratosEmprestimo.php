<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class INSSHistoryContratosEmprestimo extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_cliente', 'id_beneficio', 'contrato', 'tipo_emprestimo_codigo', 'tipo_emprestimo_descricao', 'banco_codigo', 'banco_nome', 'data_inicio_contrato', 'competencia_inicio_desconto', 'competencia_fim_desconto', 'data_inclusao', 'situacao', 'excluido_aps', 'excluido_banco', 'valor_emprestado', 'valor_parcela', 'quantidade_parcelas', 'quantidade_parcelas_emaberto', 'saldo_quitacao', 'taxa', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'inss_historico_contratos_emprestimo';

}
