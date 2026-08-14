<?php

namespace Database\Seeders;

use App\Models\InsurancePackage;
use App\Models\InsuredPerson;
use App\Models\Policy;
use App\Models\Travel;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Popunjavanje baze početnim podacima za demonstraciju aplikacije.
 * Lozinka za sve demo naloge je: "password".
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- Demo nalozi za sve tri uloge ---
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'TravelSafe',
            'email' => 'admin@travelsafe.test',
            'password' => 'password',
            'role' => User::ROLE_ADMIN,
            'is_active' => true,
        ]);

        $agent = User::create([
            'first_name' => 'Marko',
            'last_name' => 'Agentović',
            'email' => 'agent@travelsafe.test',
            'password' => 'password',
            'role' => User::ROLE_AGENT,
            'is_active' => true,
        ]);

        $client = User::create([
            'first_name' => 'Ana',
            'last_name' => 'Jovanović',
            'email' => 'ana@travelsafe.test',
            'password' => 'password',
            'role' => User::ROLE_CLIENT,
            'is_active' => true,
        ]);

        // --- Tri paketa osiguranja ---
        $basic = InsurancePackage::create([
            'name' => 'Basic',
            'description' => 'Osnovno pokriće za kratka putovanja — hitna medicinska pomoć.',
            'base_price' => 3.50,
            'coverage_amount' => 10000,
            'is_active' => true,
        ]);

        InsurancePackage::create([
            'name' => 'Standard',
            'description' => 'Prošireno pokriće uz osiguranje prtljaga i otkaz putovanja.',
            'base_price' => 6.00,
            'coverage_amount' => 30000,
            'is_active' => true,
        ]);

        InsurancePackage::create([
            'name' => 'Premium',
            'description' => 'Najviši nivo pokrića uz asistenciju 24/7 i osiguranje od nezgode.',
            'base_price' => 9.50,
            'coverage_amount' => 100000,
            'is_active' => true,
        ]);

        // --- Demo putovanje sa dve osigurane osobe i podnetim zahtevom ---
        $travel = Travel::create([
            'destination_country' => 'Grčka',
            'start_date' => now()->addWeek()->toDateString(),
            'end_date' => now()->addWeeks(2)->toDateString(),
            'travel_purpose' => Travel::PURPOSE_TOURISM,
            'client_id' => $client->id,
        ]);

        InsuredPerson::create([
            'first_name' => 'Ana',
            'last_name' => 'Jovanović',
            'date_of_birth' => '1995-04-12',
            'passport_number' => 'RS1234567',
            'travel_id' => $travel->id,
        ]);

        InsuredPerson::create([
            'first_name' => 'Petar',
            'last_name' => 'Jovanović',
            'date_of_birth' => '1992-09-30',
            'passport_number' => 'RS7654321',
            'travel_id' => $travel->id,
        ]);

        // Podnet zahtev koji agent može odmah da obradi.
        Policy::create([
            'status' => Policy::STATUS_SUBMITTED,
            'client_id' => $client->id,
            'travel_id' => $travel->id,
            'insurance_package_id' => $basic->id,
        ]);
    }
}
