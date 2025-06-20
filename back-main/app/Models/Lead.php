<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'nome', 'cpf', 'celular', 'email', 'cidade', 'uf', 'valor_disponivel', 'idade', 'categoria', 'status', 'canal', 'uuid','valor_selecionado','parcelas_selecionadas','valor_parcela_selecionada','valor','produto','code','ip'];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    protected $table = 'lead';

}
