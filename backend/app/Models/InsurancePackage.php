<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model paketa putnog osiguranja (npr. Basic, Standard, Premium).
 */
class InsurancePackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'base_price',        // Osnovna dnevna cena po osiguranoj osobi
        'coverage_amount',   // Iznos pokrića (osigurana suma)
        'is_active',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'coverage_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relacija: jedan paket može biti korišćen na više polisa.
    public function policies(): HasMany
    {
        return $this->hasMany(Policy::class);
    }
}
