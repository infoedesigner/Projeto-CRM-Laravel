<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tabela extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_banco', 'nome', 'data_cadastro', 'comissao', 'status', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'tabela';

}
