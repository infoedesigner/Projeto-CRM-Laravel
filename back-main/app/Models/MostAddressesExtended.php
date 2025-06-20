<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MostAddressesExtended extends Model
{
    use HasFactory;

    protected $fillable = [        
                            'most_enrichment_id',
                            'status',
                            'errors',
                            'typology',
                            'title',
                            'addressMain',
                            'number',
                            'complement',
                            'neighborhood',
                            'zipCode',
                            'city',
                            'state',
                            'country',
                            'type',
                            'addressCurrentlyInRFSite',
                            'complementType',
                            'buildCode',
                            'buildingCode',
                            'householdCode',
                            'addressEntityAge',
                            'addressEntityTotalPassages',
                            'addressEntityBadPassages',
                            'addressEntityCrawlingPassages',
                            'addressEntityValidationPassages',
                            'addressEntityQueryPassages',
                            'addressEntityMonthAveragePassages',
                            'addressGlobalAge',
                            'addressGlobalTotalPassages',
                            'addressGlobalBadPassages',
                            'addressGlobalCrawlingPassages',
                            'addressGlobalValidationPassages',
                            'addressGlobalQueryPassages',
                            'addressGlobalMonthAveragePassages',
                            'addressNumberOfEntities',
                            'priority',
                            'isMainForEntity',
                            'isRecentForEntity',
                            'isMainForOtherEntity',
                            'isRecentForOtherEntity',
                            'isActive',
                            'isRatified',
                            'isLikelyFromAccountant',
                            'lastValidationDate',
                            'entityFirstPassageDate',
                            'entityLastPassageDate',
                            'globalFirstPassageDate',
                            'globalLastPassageDate',
                            'creationDate',
                            'lastUpdateDate',
                            'hasOptIn',
                            'latitude',
                            'longitude',
                            ] ;
    
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    
    protected $table = 'most_addresses_extended' ;
}

