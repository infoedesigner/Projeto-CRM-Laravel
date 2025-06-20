<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'produto', 'descricao', 'lp_code', 'tipo', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'produto';

}
