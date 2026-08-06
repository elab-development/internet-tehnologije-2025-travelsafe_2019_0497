<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 1 — kreiranje tabele "insurance_packages" (paketi osiguranja).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insurance_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');                        // Naziv paketa (npr. Basic)
            $table->text('description')->nullable();       // Kratak opis paketa
            $table->decimal('base_price', 10, 2);          // Osnovna dnevna cena po putniku
            $table->decimal('coverage_amount', 12, 2);     // Iznos pokrića (osigurana suma)
            $table->boolean('is_active')->default(true);   // Da li se paket trenutno nudi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insurance_packages');
    }
};
