<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class XMLCredito extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_beneficio', 'cpf', 'beneficio', 'json_response', 'tipo', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'xml_credito';

}
