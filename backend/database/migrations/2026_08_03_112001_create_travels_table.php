<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MIGRACIJA TIP 1 — kreiranje tabele "travels" (putovanja).
 * Kolona client_id se kreira kao obična kolona; strani ključ se dodaje kasnije.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travels', function (Blueprint $table) {
            $table->id();
            $table->string('destination_country');         // Zemlja destinacije
            $table->date('start_date');                    // Datum početka putovanja
            $table->date('end_date');                      // Datum kraja putovanja
            $table->string('travel_purpose');              // Svrha: TOURISM / BUSINESS / STUDY
            $table->unsignedBigInteger('client_id');       // Vlasnik putovanja (FK se dodaje kasnije)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travels');
    }
};
