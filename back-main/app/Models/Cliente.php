<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use mysql_xdevapi\Table;

class Cliente extends Model
{
    use HasFactory;

    protected $table = "cliente";
    protected $fillable = ['id', 'id_lead', 'nome', 'cpf', 'data_nascimento', 'rg', 'orgao_emissor', 'nacionalidade', 'genero', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'cep', 'estado', 'genero', 'obito', 'email', 'celular', 'pai', 'mae', 'alfabetizado', 'tem_representante_legal', 'status'];
}
