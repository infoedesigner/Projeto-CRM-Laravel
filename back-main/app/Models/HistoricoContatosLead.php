<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoContatosLead extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'user_id', 'id_lead', 'tipo_contato', 'assunto', 'descricao', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'historico_contatos_lead';

}
