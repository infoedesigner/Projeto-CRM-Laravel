<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rotinas extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_rotina_pai', 'id_proxima_rotina', 'rotina', 'descricao', 'status', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'rotinas';

}
