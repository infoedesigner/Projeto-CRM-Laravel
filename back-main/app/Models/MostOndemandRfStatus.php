<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MostOndemandRfStatus extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'most_enrichment_id',
        'status',
        'fromCache',
        'errors',
        'matchKeys',
        'origin',
        'inputParameters',
        'protocolNumber',
        'baseStatus',
        'name',
        'birthdate',
        'queryTime',
        'socialName',
        'digit',
        'registrationDate',
        'isDead',
        'deathYear',
        'rawResultFile',
        'rawResultFileType',
    ];
    
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    
    protected $table = 'most_ondemand_rf_status' ;

}
