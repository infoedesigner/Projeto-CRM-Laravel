<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CondicoesCreditoParcelas extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_consulta_credito', 'uuid', 'parcelas_num_parcela', 'parcelas_valor_parcela', 'parcelas_data_vencimento', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'condicoes_credito_parcelas';

}
