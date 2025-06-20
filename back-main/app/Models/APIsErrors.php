<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class APIsErrors extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'provedor', 'error', 'error_code','cpf','url'];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    protected $table = 'errors_apis';

}
