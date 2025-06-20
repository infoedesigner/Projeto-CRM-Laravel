<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegrasNegocio extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'regra', 'range_inicial', 'range_final', 'tipo', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected $table = 'regras_negocio';

}
