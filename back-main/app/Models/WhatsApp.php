<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsApp extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'number', 'body', 'created_at', 'updated_at', 'deleted_at'];

    protected $table = 'whatsapp_incoming';

}
