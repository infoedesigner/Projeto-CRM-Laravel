<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsApiMessages extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'to_id', 'from_id', 'message_id', 'message_date', 'type', 'body', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected $table = 'whats_api_messages';
}
