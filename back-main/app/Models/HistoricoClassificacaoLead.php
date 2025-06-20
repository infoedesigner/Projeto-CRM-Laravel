<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoClassificacaoLead extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'lead_id', 'categoria', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'historico_classificacao_lead';

}
