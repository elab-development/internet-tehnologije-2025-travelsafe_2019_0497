<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 2 — dodavanje kolone u postojeću tabelu.
 * U tabelu "policies" dodajemo kolonu "rejection_reason" (razlog odbijanja zahteva).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('total_price');
        });
    }

    public function down(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });
    }
};
