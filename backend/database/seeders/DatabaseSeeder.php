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
 *
 * Seeder se pokreće pri svakom podizanju backend kontejnera (migrate:fresh --seed),
 * pa svako pokretanje daje isto, unapred poznato stanje sistema: pet korisnika,
 * četiri paketa i sedam polisa raspoređenih po svim statusima životnog ciklusa.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        [$admin, $agent, $ana] = $this->createUsers();
        $packages = $this->createPackages();
        $this->createTravelsAndPolicies($ana, $agent, $packages);
    }

    /** Demo nalozi za sve tri uloge, uključujući i jedan deaktiviran nalog. */
    private function createUsers(): array
    {
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

        $ana = User::create([
            'first_name' => 'Ana',
            'last_name' => 'Jovanović',
            'email' => 'ana@travelsafe.test',
            'password' => 'password',
            'role' => User::ROLE_CLIENT,
            'is_active' => true,
        ]);

        // Drugi klijent — da administratorska tabela korisnika ima više redova.
        User::create([
            'first_name' => 'Jelena',
            'last_name' => 'Popović',
            'email' => 'jelena@travelsafe.test',
            'password' => 'password',
            'role' => User::ROLE_CLIENT,
            'is_active' => true,
        ]);

        // Deaktiviran nalog — pokazuje kako izgleda korisnik bez prava pristupa.
        User::create([
            'first_name' => 'Stefan',
            'last_name' => 'Ilić',
            'email' => 'stefan@travelsafe.test',
            'password' => 'password',
            'role' => User::ROLE_CLIENT,
            'is_active' => false,
        ]);

        return [$admin, $agent, $ana];
    }

    /** Tri aktivna paketa i jedan povučen iz ponude. */
    private function createPackages(): array
    {
        $basic = InsurancePackage::create([
            'name' => 'Basic',
            'description' => 'Osnovno pokriće za kratka putovanja — hitna medicinska pomoć.',
            'base_price' => 3.50,
            'coverage_amount' => 10000,
            'is_active' => true,
        ]);

        $standard = InsurancePackage::create([
            'name' => 'Standard',
            'description' => 'Prošireno pokriće uz osiguranje prtljaga i otkaz putovanja.',
            'base_price' => 6.00,
            'coverage_amount' => 30000,
            'is_active' => true,
        ]);

        $premium = InsurancePackage::create([
            'name' => 'Premium',
            'description' => 'Najviši nivo pokrića uz asistenciju 24/7 i osiguranje od nezgode.',
            'base_price' => 9.50,
            'coverage_amount' => 100000,
            'is_active' => true,
        ]);

        // Neaktivan paket — vidi ga samo administrator, dok je klijentima sakriven.
        InsurancePackage::create([
            'name' => 'Family',
            'description' => 'Paket za porodična putovanja; privremeno povučen iz ponude radi revizije cenovnika.',
            'base_price' => 7.50,
            'coverage_amount' => 50000,
            'is_active' => false,
        ]);

        return compact('basic', 'standard', 'premium');
    }

    /**
     * Sedam putovanja klijenta Ane, sa polisama u svim fazama životnog ciklusa:
     * dve aktivne, jedna odobrena koja čeka plaćanje, jedna odbijena i tri podneta zahteva.
     */
    private function createTravelsAndPolicies(User $client, User $agent, array $packages): void
    {
        $plan = [
            ['Italija',  14,  24, Travel::PURPOSE_TOURISM,  'standard', 'pay',     120.00, null],
            ['Nemačka',  40,  47, Travel::PURPOSE_BUSINESS, 'premium',  'pay',      66.50, null],
            ['Španija',  70,  84, Travel::PURPOSE_TOURISM,  'premium',  'approve', 399.00, null],
            ['Turska',   95, 105, Travel::PURPOSE_TOURISM,  'basic',    'reject',    null,
                'Za izabranu destinaciju paket Basic ne pokriva planirane aktivnosti.'],
            ['Austrija', 120, 127, Travel::PURPOSE_STUDY,   'standard', 'submit',    null, null],
            ['Grčka',    150, 160, Travel::PURPOSE_TOURISM, 'standard', 'submit',    null, null],
            ['Francuska', 180, 190, Travel::PURPOSE_TOURISM, 'basic',   'submit',    null, null],
        ];

        $passengers = [
            ['Ana', 'Jovanović', '1995-04-12'],
            ['Petar', 'Jovanović', '1992-09-30'],
            ['Milan', 'Ilić', '1988-02-05'],
        ];

        $passportCounter = 2200100;

        foreach ($plan as $index => [$destination, $startOffset, $endOffset, $purpose, $packageKey, $action, $price, $reason]) {
            $travel = Travel::create([
                'destination_country' => $destination,
                'start_date' => now()->addDays($startOffset)->toDateString(),
                'end_date' => now()->addDays($endOffset)->toDateString(),
                'travel_purpose' => $purpose,
                'client_id' => $client->id,
            ]);

            // Broj putnika varira od jednog do tri, radi realnijeg prikaza.
            $passengerCount = ($index % 3) + 1;

            for ($i = 0; $i < $passengerCount; $i++) {
                [$firstName, $lastName, $birthDate] = $passengers[$i];

                InsuredPerson::create([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'date_of_birth' => $birthDate,
                    'passport_number' => 'RS' . (++$passportCounter),
                    'travel_id' => $travel->id,
                ]);
            }

            $policy = Policy::create([
                'status' => Policy::STATUS_SUBMITTED,
                'client_id' => $client->id,
                'travel_id' => $travel->id,
                'insurance_package_id' => $packages[$packageKey]->id,
            ]);

            $this->applyAgentDecision($policy, $agent, $action, $price, $reason);
        }
    }

    /** Simulira odluku agenta i, gde je predviđeno, plaćanje od strane klijenta. */
    private function applyAgentDecision(Policy $policy, User $agent, string $action, ?float $price, ?string $reason): void
    {
        if ($action === 'submit') {
            return;
        }

        if ($action === 'reject') {
            $policy->update([
                'status' => Policy::STATUS_REJECTED,
                'rejection_reason' => $reason,
                'agent_id' => $agent->id,
            ]);

            return;
        }

        // Odobravanje: agent unosi cenu, a sistem dodeljuje broj polise.
        $policy->update([
            'status' => Policy::STATUS_APPROVED,
            'total_price' => $price,
            'agent_id' => $agent->id,
            'policy_number' => 'TS-' . now()->year . '-' . strtoupper(substr(md5((string) $policy->id), 0, 6)),
        ]);

        if ($action === 'pay') {
            $policy->update(['status' => Policy::STATUS_ACTIVE]);
        }
    }
}
