<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware za proveru korisničke uloge.
 * Koristi se u ruti ovako: ->middleware('role:ADMIN') ili 'role:AGENT,ADMIN'.
 * Više dozvoljenih uloga se navodi razdvojeno zarezom.
 */
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Ako korisnik nije prijavljen — 401 (nije autentifikovan).
        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Ako je nalog deaktiviran — zabranjujemo pristup.
        if (! $user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated.',
            ], 403);
        }

        // Ako uloga korisnika nije među dozvoljenima — 403 (zabranjeno).
        if (! in_array($user->role, $roles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to perform this action.',
            ], 403);
        }

        return $next($request);
    }
}
