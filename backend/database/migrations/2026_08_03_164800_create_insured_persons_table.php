<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 1 — kreiranje tabele "insured_persons" (osigurane osobe).
 * Jedinstvenost pasoša i strani ključ dodaju se u kasnijoj migraciji.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insured_persons', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');                  // Ime osigurane osobe
            $table->string('last_name');                   // Prezime osigurane osobe
            $table->date('date_of_birth');                 // Datum rođenja
            $table->string('passport_number');             // Broj pasoša
            $table->unsignedBigInteger('travel_id');       // Putovanje kome osoba pripada
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insured_persons');
    }
};
