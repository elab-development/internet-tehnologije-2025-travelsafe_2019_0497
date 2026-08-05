<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 3 — dodavanje stranih ključeva i jedinstvenih ograničenja.
 * Ovim povezujemo tabele i garantujemo referencijalni integritet baze.
 */
return new class extends Migration
{
    public function up(): void
    {
        // travels.client_id -> users.id (brisanjem korisnika brišu se i njegova putovanja)
        Schema::table('travels', function (Blueprint $table) {
            $table->foreign('client_id')->references('id')->on('users')->cascadeOnDelete();
        });

        // insured_persons.travel_id -> travels.id + jedinstven broj pasoša
        Schema::table('insured_persons', function (Blueprint $table) {
            $table->foreign('travel_id')->references('id')->on('travels')->cascadeOnDelete();
            $table->unique('passport_number');
        });

        // policies -> users (klijent i agent), travels, insurance_packages + jedinstven broj polise
        Schema::table('policies', function (Blueprint $table) {
            $table->foreign('client_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('agent_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('travel_id')->references('id')->on('travels')->cascadeOnDelete();
            $table->foreign('insurance_package_id')->references('id')->on('insurance_packages')->cascadeOnDelete();
            $table->unique('policy_number');
        });
    }

    public function down(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropForeign(['agent_id']);
            $table->dropForeign(['travel_id']);
            $table->dropForeign(['insurance_package_id']);
            $table->dropUnique(['policy_number']);
        });

        Schema::table('insured_persons', function (Blueprint $table) {
            $table->dropForeign(['travel_id']);
            $table->dropUnique(['passport_number']);
        });

        Schema::table('travels', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
        });
    }
};
