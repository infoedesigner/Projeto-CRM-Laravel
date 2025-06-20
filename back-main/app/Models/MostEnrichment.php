<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MostEnrichment extends Model
{
    use HasFactory;
    
    protected $fillable = ['id', 'id_beneficio', 'requestId', 'elapsedMilliseconds', 'message', 'code', 'errors', 'processId', 'tier', 'query', 'status', 'cpf'] ;
    
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    
    protected $table = 'most_enrichment' ;

}
