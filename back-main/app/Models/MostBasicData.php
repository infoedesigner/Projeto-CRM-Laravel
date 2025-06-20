<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MostBasicData extends Model
{
    use HasFactory;

    protected $fillable = [
        'most_enrichment_id',
        'status',
        'fromCache',
        'errors',
        'matchKeys',
        'name',
        'commonName',
        'standardizedizedName',
        'gender',
        'nameWordCount',
        'numberOfFullNameNamesakes',
        'nameUniquenessScore',
        'firstNameUniquenessScore',
        'firstAndLastNameUniquenessScore',
        'birthDate',
        'age',
        'zodiacSign',
        'chineseSign',
        'birthCountry',
        'motherName',
        'fatherName',
        'maritalStatusData',
        'taxIdStatus',
        'taxIdOrigin',
        'taxIdFiscalRegion',
        'hasObitIndication',
        'taxIdStatusDate',
        'taxIdStatusRegistrationDate',
        'creationDate',
        'lastUpdateDate',
    ];
    
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    
    protected $table = 'most_basic_data' ;

}
