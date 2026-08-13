<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

/**
 * Kontroler za autentifikaciju (registracija, prijava, odjava, trenutni korisnik).
 * Koristi Laravel Sanctum za izdavanje pristupnih tokena.
 */
class AuthController extends Controller
{
    use ApiResponse;

    // Registracija novog korisnika — podrazumevana uloga je CLIENT.
    public function register(Request $request): JsonResponse
    {
        // Validacija ulaznih podataka; poruke o grešci Laravel vraća automatski (422).
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        // Kreiramo korisnika; lozinka se automatski hešira zbog "hashed" cast-a na modelu.
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => User::ROLE_CLIENT,
            'is_active' => true,
        ]);

        // Odmah izdajemo token da korisnik bude prijavljen posle registracije.
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'Registration successful', 201);
    }

    // Prijava postojećeg korisnika.
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Tražimo korisnika po email-u i ručno proveravamo lozinku.
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return $this->error('Invalid email or password', 401);
        }

        // Deaktivirani nalozi ne mogu da se prijave.
        if (! $user->is_active) {
            return $this->error('Your account has been deactivated.', 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'Login successful');
    }

    // Odjava — brišemo samo trenutni token (ostale sesije ostaju netaknute).
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logout successful');
    }

    // Podaci o trenutno prijavljenom korisniku (koristi frontend pri osvežavanju stranice).
    public function me(Request $request): JsonResponse
    {
        return $this->success($request->user(), 'Current user');
    }
}
