<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model osobe koja se osigurava u okviru jednog putovanja.
 */
class InsuredPerson extends Model
{
    use HasFactory;

    // Eksplicitan naziv tabele (podrazumevana pluralizacija za "InsuredPerson" daje "insured_people").
    protected $table = 'insured_persons';

    protected $fillable = [
        'first_name',
        'last_name',
        'date_of_birth',
        'passport_number',
        'travel_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // Relacija: osigurana osoba pripada jednom putovanju.
    public function travel(): BelongsTo
    {
        return $this->belongsTo(Travel::class);
    }
}
