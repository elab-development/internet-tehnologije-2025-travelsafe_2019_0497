<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 4 (dodatna) — izmena šeme dodavanjem indeksa.
 * Indeks na koloni "status" ubrzava filtriranje polisa po statusu,
 * što je česta operacija (npr. agent gleda samo pristigle zahteve).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
