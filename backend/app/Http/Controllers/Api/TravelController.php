<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Travel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Kontroler za putovanja.
 * Klijent upravlja isključivo svojim putovanjima; agent i admin mogu da ih pregledaju.
 */
class TravelController extends Controller
{
    use ApiResponse;

    // Lista putovanja: klijent vidi samo svoja, agent/admin vide sva.
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Travel::with(['insuredPersons', 'policy', 'client']);

        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        }

        return $this->success($query->latest()->get(), 'Travels list');
    }

    // Kreiranje novog putovanja — vlasnik je uvek prijavljeni klijent.
    public function store(Request $request): JsonResponse
    {
        $data = $this->validateData($request);
        $data['client_id'] = $request->user()->id;

        $travel = Travel::create($data);

        return $this->success($travel->load('insuredPersons'), 'Travel created', 201);
    }

    // Detalji jednog putovanja.
    public function show(Request $request, Travel $travel): JsonResponse
    {
        $this->authorizeOwnership($request, $travel);

        return $this->success($travel->load(['insuredPersons', 'policy', 'client']), 'Travel details');
    }

    // Izmena putovanja.
    public function update(Request $request, Travel $travel): JsonResponse
    {
        $this->authorizeOwnership($request, $travel);

        $travel->update($this->validateData($request, creating: false));

        return $this->success($travel->load('insuredPersons'), 'Travel updated');
    }

    // Brisanje putovanja (kaskadno briše i osigurane osobe i polisu).
    public function destroy(Request $request, Travel $travel): JsonResponse
    {
        $this->authorizeOwnership($request, $travel);

        $travel->delete();

        return $this->success(null, 'Travel deleted');
    }

    // Zajednička validacija za kreiranje i izmenu putovanja.
    private function validateData(Request $request, bool $creating = true): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return $request->validate([
            'destination_country' => [$required, 'string', 'max:100'],
            'start_date' => [$required, 'date'],
            'end_date' => [$required, 'date', 'after_or_equal:start_date'],
            'travel_purpose' => [$required, Rule::in([
                Travel::PURPOSE_TOURISM,
                Travel::PURPOSE_BUSINESS,
                Travel::PURPOSE_STUDY,
            ])],
        ]);
    }

    // Klijent sme da vidi/menja samo svoja putovanja; agent i admin smeju sva.
    private function authorizeOwnership(Request $request, Travel $travel): void
    {
        $user = $request->user();

        if ($user->isClient() && $travel->client_id !== $user->id) {
            // abort() vraća JSON grešku jer frontend šalje zaglavlje Accept: application/json.
            abort(403, 'This travel does not belong to you.');
        }
    }
}
