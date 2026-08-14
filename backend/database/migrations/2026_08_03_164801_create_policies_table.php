<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 1 — kreiranje tabele "policies" (zahtevi/polise).
 * Kolona rejection_reason i strani ključevi dodaju se u zasebnim migracijama.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->string('policy_number')->nullable();          // Broj polise (dodeljuje se pri odobrenju)
            $table->string('status')->default('SUBMITTED');       // Status zahteva/polise
            $table->decimal('total_price', 10, 2)->nullable();    // Konačna cena (unosi agent)
            $table->unsignedBigInteger('client_id');              // Klijent koji je podneo zahtev
            $table->unsignedBigInteger('agent_id')->nullable();   // Agent koji obrađuje zahtev
            $table->unsignedBigInteger('travel_id');              // Povezano putovanje
            $table->unsignedBigInteger('insurance_package_id');   // Izabrani paket osiguranja
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('policies');
    }
};
