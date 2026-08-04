<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Model putovanja koje klijent prijavljuje pri traženju osiguranja.
 */
class Travel extends Model
{
    use HasFactory;

    // Dozvoljene vrednosti za svrhu putovanja.
    public const PURPOSE_TOURISM = 'TOURISM';
    public const PURPOSE_BUSINESS = 'BUSINESS';
    public const PURPOSE_STUDY = 'STUDY';

    // Eksplicitan naziv tabele (podrazumevana pluralizacija za "Travel" ne odgovara).
    protected $table = 'travels';

    protected $fillable = [
        'destination_country',
        'start_date',
        'end_date',
        'travel_purpose',
        'client_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relacija: putovanje pripada jednom klijentu (korisniku).
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Relacija: putovanje ima više osiguranih osoba.
    public function insuredPersons(): HasMany
    {
        return $this->hasMany(InsuredPerson::class);
    }

    // Relacija: jedno putovanje ima jednu polisu.
    public function policy(): HasOne
    {
        return $this->hasOne(Policy::class);
    }
}
