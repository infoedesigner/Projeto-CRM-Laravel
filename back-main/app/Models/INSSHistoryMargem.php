<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class INSSHistoryMargem extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_cliente', 'id_beneficio', 'situacao_beneficio', 'uuid', 'nit', 'identidade', 'sexo', 'uf', 'dib', 'valor_beneficio', 'possui_representante_procurador', 'possui_representante_legal', 'possui_procurador', 'pensao_alimenticia', 'bloqueio_emprestimo', 'beneficio_permite_emprestimo', 'margem_competencia', 'margem_base_calculo_margem_consig', 'margem_disponivel_emprestimo', 'margem_disponivel_emprestimo_on', 'margem_percentual_margem_disponivel_emprestimo', 'margem_percentual_total_emprestimo', 'margem_quantidade_emprestimo', 'margem_possui_cartao', 'margem_margem_disponivel_cartao', 'margem_percentual_margem_disponivel_cartao', 'margem_percentual_margem_total_cartao', 'margem_possui_cartao_beneficio', 'margem_disponivel_cartao_beneficio', 'representante_legal_nome', 'tipo', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'inss_historico_margem';

}
