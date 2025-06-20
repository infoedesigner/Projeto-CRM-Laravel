<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocsValidacao extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_beneficio', 'id_cliente', 'etapa', 'status', 'api_tipo_validacao', 'api_id_requisicao', 'api_codigo_status', 'api_resposta_json', 'api_tipo_documento', 'api_subtipo_documento', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'docs_validacao';

}
