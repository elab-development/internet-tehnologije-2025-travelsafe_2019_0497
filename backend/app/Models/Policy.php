<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model polise — predstavlja zahtev za osiguranje i kasnije izdatu polisu.
 */
class Policy extends Model
{
    use HasFactory;

    // Konstante statusa — pokrivaju ceo životni ciklus zahteva/polise.
    public const STATUS_SUBMITTED = 'SUBMITTED';               // Zahtev je podnet
    public const STATUS_UNDER_REVIEW = 'UNDER_REVIEW';         // Agent je preuzeo zahtev
    public const STATUS_APPROVED = 'APPROVED';                 // Zahtev odobren
    public const STATUS_REJECTED = 'REJECTED';                 // Zahtev odbijen
    public const STATUS_PAYMENT_PENDING = 'PAYMENT_PENDING';   // Čeka se plaćanje
    public const STATUS_ACTIVE = 'ACTIVE';                     // Plaćena i aktivna polisa
    public const STATUS_EXPIRED = 'EXPIRED';                   // Istekla polisa

    protected $fillable = [
        'policy_number',
        'status',
        'total_price',
        'rejection_reason',
        'client_id',
        'agent_id',
        'travel_id',
        'insurance_package_id',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    // Relacija: polisa pripada klijentu koji je podneo zahtev.
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Relacija: polisu obrađuje jedan agent.
    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    // Relacija: polisa se odnosi na jedno putovanje.
    public function travel(): BelongsTo
    {
        return $this->belongsTo(Travel::class);
    }

    // Relacija: polisa koristi jedan paket osiguranja.
    public function insurancePackage(): BelongsTo
    {
        return $this->belongsTo(InsurancePackage::class);
    }
}
