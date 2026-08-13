<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InsurancePackage;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Kontroler za pakete osiguranja.
 * Pregled je javan (samo aktivni paketi), a kreiranje/izmena/brisanje su rezervisani za ADMIN.
 */
class InsurancePackageController extends Controller
{
    use ApiResponse;

    // Lista paketa: obični korisnici vide samo aktivne, a ADMIN vidi sve.
    public function index(Request $request): JsonResponse
    {
        $query = InsurancePackage::query();

        // Ruta je javna, pa korisnika (ako je prijavljen) čitamo preko sanctum guard-a.
        $user = auth('sanctum')->user();

        if (! $user || ! $user->isAdmin()) {
            $query->where('is_active', true);
        }

        return $this->success($query->orderBy('base_price')->get(), 'Insurance packages');
    }

    // Detalji jednog paketa.
    public function show(InsurancePackage $insurancePackage): JsonResponse
    {
        return $this->success($insurancePackage, 'Insurance package details');
    }

    // Kreiranje novog paketa (ADMIN).
    public function store(Request $request): JsonResponse
    {
        $data = $this->validateData($request);

        $package = InsurancePackage::create($data);

        return $this->success($package, 'Insurance package created', 201);
    }

    // Izmena postojećeg paketa (ADMIN).
    public function update(Request $request, InsurancePackage $insurancePackage): JsonResponse
    {
        $data = $this->validateData($request, creating: false);

        $insurancePackage->update($data);

        return $this->success($insurancePackage, 'Insurance package updated');
    }

    // Brisanje paketa (ADMIN).
    public function destroy(InsurancePackage $insurancePackage): JsonResponse
    {
        $insurancePackage->delete();

        return $this->success(null, 'Insurance package deleted');
    }

    // Zajednička validacija za kreiranje i izmenu paketa.
    private function validateData(Request $request, bool $creating = true): array
    {
        // Pri kreiranju su polja obavezna; pri izmeni su opciona ("sometimes").
        $required = $creating ? 'required' : 'sometimes';

        return $request->validate([
            'name' => [$required, 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'base_price' => [$required, 'numeric', 'min:0'],
            'coverage_amount' => [$required, 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }
}
