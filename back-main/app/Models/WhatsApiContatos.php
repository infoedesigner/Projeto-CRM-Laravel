<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsApiContatos extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'name', 'wa_id', 'created_at', 'update_at', 'deleted_at'
    ];

    protected $table = 'whats_api_contatos';
}
