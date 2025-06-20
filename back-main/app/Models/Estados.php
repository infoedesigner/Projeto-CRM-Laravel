<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use mysql_xdevapi\Table;

class Estados extends Model
{
    protected $table = 'estados';
    protected $fillable = ['id', 'codigo_uf', 'uf', 'nome', 'latitude', 'longitude', 'regiao'];
    use HasFactory;
}
