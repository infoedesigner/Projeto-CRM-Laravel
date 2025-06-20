<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotor extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'provider', 'codigo', 'nome', 'identificador', 'nome_parceiro', 'padrao', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'promotor';

}
