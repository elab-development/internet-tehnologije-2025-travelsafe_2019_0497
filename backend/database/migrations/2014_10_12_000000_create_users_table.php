<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 1 — kreiranje tabele "users".
 * Ovde definišemo osnovne kolone korisnika. Kolona "is_active" se namerno
 * dodaje u zasebnoj migraciji kako bismo prikazali i drugi tip migracije.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();                                 // Primarni ključ (BIGINT UNSIGNED)
            $table->string('first_name');                 // Ime korisnika
            $table->string('last_name');                  // Prezime korisnika
            $table->string('email')->unique();            // Email (jedinstven) — koristi se za prijavu
            $table->string('password');                   // Heširana lozinka
            $table->string('role')->default('CLIENT');    // Uloga: CLIENT / AGENT / ADMIN
            $table->timestamps();                         // created_at i updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
