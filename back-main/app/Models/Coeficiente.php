<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coeficiente extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_tabela', 'qtde_parcela', 'coeficiente', 'data'];

    protected $table = 'coeficiente';

}
