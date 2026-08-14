<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Model korisnika aplikacije.
 * Jedan korisnik može biti CLIENT, AGENT ili ADMIN — ulogu čuvamo u koloni "role".
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Konstante uloga — koristimo ih umesto "golih" stringova radi čitljivosti i manje grešaka.
    public const ROLE_CLIENT = 'CLIENT';
    public const ROLE_AGENT = 'AGENT';
    public const ROLE_ADMIN = 'ADMIN';

    // Kolone koje je dozvoljeno masovno popuniti (mass assignment).
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    // Kolone koje se nikada ne vraćaju u JSON odgovoru (bezbednost).
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Automatska konverzija tipova kolona.
    protected $casts = [
        'password' => 'hashed',   // Laravel automatski hešira lozinku prilikom čuvanja.
        'is_active' => 'boolean',
    ];

    // Relacija: jedan korisnik (klijent) može imati više putovanja.
    public function travels(): HasMany
    {
        return $this->hasMany(Travel::class, 'client_id');
    }

    // Relacija: klijent može imati više polisa (kao podnosilac zahteva).
    public function policies(): HasMany
    {
        return $this->hasMany(Policy::class, 'client_id');
    }

    // Relacija: agent može obraditi više polisa (kao zadužena osoba).
    public function processedPolicies(): HasMany
    {
        return $this->hasMany(Policy::class, 'agent_id');
    }

    // Pomoćne metode za proveru uloge — čitljivije od poređenja stringova u kontrolerima.
    public function isClient(): bool { return $this->role === self::ROLE_CLIENT; }
    public function isAgent(): bool { return $this->role === self::ROLE_AGENT; }
    public function isAdmin(): bool { return $this->role === self::ROLE_ADMIN; }
}
