<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InsuredPerson;
use App\Models\Travel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Kontroler za osigurane osobe.
 * Osobe su ugnježdene pod putovanjem — klijent može da ih menja samo na svom putovanju.
 */
class InsuredPersonController extends Controller
{
    use ApiResponse;

    // Lista osiguranih osoba za konkretno putovanje.
    public function index(Request $request, Travel $travel): JsonResponse
    {
        $this->authorizeTravel($request, $travel);

        return $this->success($travel->insuredPersons()->get(), 'Insured persons');
    }

    // Dodavanje osigurane osobe na putovanje.
    public function store(Request $request, Travel $travel): JsonResponse
    {
        $this->authorizeTravel($request, $travel);

        $data = $this->validateData($request);
        $data['travel_id'] = $travel->id;

        $person = InsuredPerson::create($data);

        return $this->success($person, 'Insured person added', 201);
    }

    // Detalji jedne osigurane osobe.
    public function show(Request $request, InsuredPerson $insuredPerson): JsonResponse
    {
        $this->authorizeTravel($request, $insuredPerson->travel);

        return $this->success($insuredPerson, 'Insured person details');
    }

    // Izmena podataka osigurane osobe.
    public function update(Request $request, InsuredPerson $insuredPerson): JsonResponse
    {
        $this->authorizeTravel($request, $insuredPerson->travel);

        // Pri proveri jedinstvenosti pasoša ignorišemo trenutni zapis.
        $data = $this->validateData($request, $insuredPerson->id);
        $insuredPerson->update($data);

        return $this->success($insuredPerson, 'Insured person updated');
    }

    // Uklanjanje osigurane osobe.
    public function destroy(Request $request, InsuredPerson $insuredPerson): JsonResponse
    {
        $this->authorizeTravel($request, $insuredPerson->travel);

        $insuredPerson->delete();

        return $this->success(null, 'Insured person removed');
    }

    // Validacija podataka o osiguranoj osobi.
    private function validateData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'passport_number' => [
                'required', 'string', 'max:50',
                Rule::unique('insured_persons', 'passport_number')->ignore($ignoreId),
            ],
        ]);
    }

    // Provera da putovanje pripada prijavljenom klijentu (admin/agent imaju pristup svemu).
    private function authorizeTravel(Request $request, Travel $travel): void
    {
        $user = $request->user();

        if ($user->isClient() && $travel->client_id !== $user->id) {
            abort(403, 'This travel does not belong to you.');
        }
    }
}
