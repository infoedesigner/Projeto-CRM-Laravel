<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CondicoesCreditoDespesas extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_consulta_credito', 'uuid', 'despesas_codigo', 'despesas_grupo', 'despesas_financiada', 'despesas_tipo', 'despesas_inclusa', 'despesas_numero_item', 'despesas_valor_calculado', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'condicoes_credito_despesas';

}
