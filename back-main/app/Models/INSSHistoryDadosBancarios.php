<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class INSSHistoryDadosBancarios extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_cliente', 'id_beneficio', 'banco_codigo', 'banco_nome', 'agencia_codigo', 'agencia_nome', 'agencia_endereco_logradouro', 'agencia_endereco_bairro', 'agencia_endereco_cidade', 'agencia_endereco_cep', 'agencia_endereco_uf', 'agencia_orgao_pagador', 'meio_pagamento_tipo', 'meio_pagamento_numero', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'inss_dados_bancarios';

}
