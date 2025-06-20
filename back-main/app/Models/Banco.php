<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banco extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'nome_banco', 'status', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'banco';

}
