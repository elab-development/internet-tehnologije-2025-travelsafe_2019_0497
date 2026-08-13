<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InsurancePackage;
use App\Models\Policy;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Kontroler za osnovnu statistiku aplikacije (ADMIN kontrolna tabla).
 */
class StatisticsController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $stats = [
            'users_total' => User::count(),
            'clients_total' => User::where('role', User::ROLE_CLIENT)->count(),
            'agents_total' => User::where('role', User::ROLE_AGENT)->count(),
            'packages_total' => InsurancePackage::count(),
            'active_packages_total' => InsurancePackage::where('is_active', true)->count(),
            'policies_total' => Policy::count(),
            // Broj polisa po statusu — koristi se za pregled na admin panelu.
            'policies_by_status' => Policy::selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            // Ukupan prihod od aktivnih (plaćenih) polisa.
            'active_revenue' => (float) Policy::where('status', Policy::STATUS_ACTIVE)->sum('total_price'),
        ];

        return $this->success($stats, 'Application statistics');
    }
}
