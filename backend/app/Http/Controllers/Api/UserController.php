<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Kontroler za administraciju korisnika (dostupno samo ADMIN ulozi).
 */
class UserController extends Controller
{
    use ApiResponse;

    // Lista svih korisnika.
    public function index(): JsonResponse
    {
        $users = User::orderByDesc('created_at')->get();

        return $this->success($users, 'Users list');
    }

    // Detalji jednog korisnika.
    public function show(User $user): JsonResponse
    {
        return $this->success($user, 'User details');
    }

    // Promena uloge korisnika (CLIENT / AGENT / ADMIN).
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', Rule::in([User::ROLE_CLIENT, User::ROLE_AGENT, User::ROLE_ADMIN])],
        ]);

        $user->update(['role' => $data['role']]);

        return $this->success($user, 'User role updated');
    }

    // Aktivacija/deaktivacija naloga (prekidač).
    public function toggleActive(Request $request, User $user): JsonResponse
    {
        // Administrator ne sme sam sebe da deaktivira (izbegavamo zaključavanje pristupa).
        if ($user->id === $request->user()->id) {
            return $this->error('You cannot change the status of your own account.', 422);
        }

        $user->update(['is_active' => ! $user->is_active]);

        return $this->success($user, $user->is_active ? 'User activated' : 'User deactivated');
    }
}
