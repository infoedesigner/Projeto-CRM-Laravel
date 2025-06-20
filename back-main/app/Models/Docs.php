<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Docs extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'id_beneficio', 'id_cliente', 'id_lead', 'filename', 'extensao', 'src_file', 'status', 'etapa_prova_vida', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'docs';

}
