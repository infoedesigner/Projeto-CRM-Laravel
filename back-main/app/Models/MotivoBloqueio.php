<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivoBloqueio extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_beneficio', 'motivo', 'valor','id_tabela','params'];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    protected $table = 'motivo_bloqueio';

}
