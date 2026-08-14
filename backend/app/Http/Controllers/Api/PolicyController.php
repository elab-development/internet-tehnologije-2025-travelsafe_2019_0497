<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Policy;
use App\Models\Travel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Kontroler za polise — pokriva ceo tok: podnošenje zahteva (klijent),
 * odobravanje/odbijanje (agent) i simulaciju plaćanja (klijent).
 */
class PolicyController extends Controller
{
    use ApiResponse;

    // Standardni skup relacija koje učitavamo uz polisu (da frontend ima sve na jednom mestu).
    private const RELATIONS = ['client', 'agent', 'travel.insuredPersons', 'insurancePackage'];

    // Lista polisa zavisi od uloge: klijent vidi svoje, agent/admin vide sve.
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Policy::with(self::RELATIONS);

        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        }

        // Opcioni filter po statusu, npr. /api/policies?status=APPROVED
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        return $this->success($query->latest()->get(), 'Policies list');
    }

    // Detalji jedne polise.
    public function show(Request $request, Policy $policy): JsonResponse
    {
        $this->authorizeView($request, $policy);

        return $this->success($policy->load(self::RELATIONS), 'Policy details');
    }

    // Klijent podnosi zahtev za polisu (bira svoje putovanje i paket).
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'travel_id' => ['required', 'exists:travels,id'],
            'insurance_package_id' => ['required', 'exists:insurance_packages,id'],
        ]);

        $travel = Travel::findOrFail($data['travel_id']);

        // Putovanje mora pripadati klijentu koji podnosi zahtev.
        if ($travel->client_id !== $user->id) {
            return $this->error('You can only insure your own travels.', 403);
        }

        // Jedno putovanje može imati samo jednu polisu.
        if ($travel->policy()->exists()) {
            return $this->error('This travel already has a policy.', 422);
        }

        // Mora postojati bar jedna osigurana osoba.
        if ($travel->insuredPersons()->count() === 0) {
            return $this->error('Add at least one insured person before submitting.', 422);
        }

        $policy = Policy::create([
            'status' => Policy::STATUS_SUBMITTED,
            'client_id' => $user->id,
            'travel_id' => $travel->id,
            'insurance_package_id' => $data['insurance_package_id'],
        ]);

        return $this->success($policy->load(self::RELATIONS), 'Policy request submitted', 201);
    }

    // Klijent može da promeni izabrani paket dok je zahtev još u statusu SUBMITTED.
    public function update(Request $request, Policy $policy): JsonResponse
    {
        $user = $request->user();

        if ($user->isClient() && $policy->client_id !== $user->id) {
            return $this->error('This policy does not belong to you.', 403);
        }

        if ($policy->status !== Policy::STATUS_SUBMITTED) {
            return $this->error('Only submitted requests can be modified.', 422);
        }

        $data = $request->validate([
            'insurance_package_id' => ['required', 'exists:insurance_packages,id'],
        ]);

        $policy->update($data);

        return $this->success($policy->load(self::RELATIONS), 'Policy updated');
    }

    // Otkazivanje/brisanje polise (klijent samo svoj SUBMITTED zahtev; admin bilo koju).
    public function destroy(Request $request, Policy $policy): JsonResponse
    {
        $user = $request->user();

        if ($user->isClient()) {
            if ($policy->client_id !== $user->id || $policy->status !== Policy::STATUS_SUBMITTED) {
                return $this->error('You can only cancel your own pending requests.', 403);
            }
        }

        $policy->delete();

        return $this->success(null, 'Policy deleted');
    }

    // AGENT odobrava zahtev i unosi konačnu cenu; generiše se broj polise.
    public function approve(Request $request, Policy $policy): JsonResponse
    {
        $data = $request->validate([
            'total_price' => ['required', 'numeric', 'min:0'],
        ]);

        if (! in_array($policy->status, [Policy::STATUS_SUBMITTED, Policy::STATUS_UNDER_REVIEW], true)) {
            return $this->error('Only submitted requests can be approved.', 422);
        }

        $policy->update([
            'status' => Policy::STATUS_APPROVED,           // Odobreno; čeka se plaćanje klijenta.
            'total_price' => $data['total_price'],
            'agent_id' => $request->user()->id,
            'policy_number' => $this->generatePolicyNumber(),
            'rejection_reason' => null,
        ]);

        return $this->success($policy->load(self::RELATIONS), 'Policy approved');
    }

    // AGENT odbija zahtev uz obavezan razlog.
    public function reject(Request $request, Policy $policy): JsonResponse
    {
        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:500'],
        ]);

        if (! in_array($policy->status, [Policy::STATUS_SUBMITTED, Policy::STATUS_UNDER_REVIEW], true)) {
            return $this->error('Only submitted requests can be rejected.', 422);
        }

        $policy->update([
            'status' => Policy::STATUS_REJECTED,
            'rejection_reason' => $data['rejection_reason'],
            'agent_id' => $request->user()->id,
        ]);

        return $this->success($policy->load(self::RELATIONS), 'Policy rejected');
    }

    // KLIJENT simulira plaćanje odobrene polise — status prelazi u ACTIVE.
    public function pay(Request $request, Policy $policy): JsonResponse
    {
        $user = $request->user();

        // Platiti može samo vlasnik polise.
        if ($policy->client_id !== $user->id) {
            return $this->error('This policy does not belong to you.', 403);
        }

        // Plaća se samo odobrena polisa.
        if ($policy->status !== Policy::STATUS_APPROVED) {
            return $this->error('Only approved policies can be paid.', 422);
        }

        $policy->update(['status' => Policy::STATUS_ACTIVE]);

        return $this->success($policy->load(self::RELATIONS), 'Payment successful, policy is now active');
    }

    // Klijent sme da vidi samo svoje polise; agent i admin sve.
    private function authorizeView(Request $request, Policy $policy): void
    {
        $user = $request->user();

        if ($user->isClient() && $policy->client_id !== $user->id) {
            abort(403, 'This policy does not belong to you.');
        }
    }

    // Generisanje jedinstvenog broja polise, npr. "TS-2026-A1B2C3".
    private function generatePolicyNumber(): string
    {
        do {
            $number = 'TS-' . now()->year . '-' . strtoupper(Str::random(6));
        } while (Policy::where('policy_number', $number)->exists());

        return $number;
    }
}
