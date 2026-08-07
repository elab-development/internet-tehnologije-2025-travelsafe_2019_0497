<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Pomoćni trait za ujednačene JSON odgovore kroz celu aplikaciju.
 * Svaki odgovor ima isti oblik: { success, message, data } — što frontendu
 * olakšava obradu i uspešnih odgovora i grešaka.
 */
trait ApiResponse
{
    // Uspešan odgovor (podaci + poruka + HTTP status kod).
    protected function success(mixed $data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    // Odgovor sa greškom (poruka + opcioni detalji + HTTP status kod).
    protected function error(string $message = 'Error', int $status = 400, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
