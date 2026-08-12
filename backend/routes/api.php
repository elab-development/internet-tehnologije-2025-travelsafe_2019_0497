<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InsurancePackageController;
use App\Http\Controllers\Api\InsuredPersonController;
use App\Http\Controllers\Api\PolicyController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\TravelController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API rute aplikacije TravelSafe
|--------------------------------------------------------------------------
| Sve rute su pod prefiksom "/api". Javne rute su dostupne svima, dok
| zaštićene rute zahtevaju važeći Sanctum token (auth:sanctum), a neke i
| određenu ulogu (middleware "role").
*/

// ---------------------- JAVNE RUTE (bez prijave) ----------------------
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Pregled aktivnih paketa osiguranja je javno dostupan.
Route::get('/insurance-packages', [InsurancePackageController::class, 'index']);
Route::get('/insurance-packages/{insurancePackage}', [InsurancePackageController::class, 'show']);

// ------------------ ZAŠTIĆENE RUTE (potreban token) -------------------
Route::middleware('auth:sanctum')->group(function () {

    // --- Autentifikacija prijavljenog korisnika ---
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // --- Putovanja (CRUD) ---
    Route::apiResource('travels', TravelController::class);

    // --- Osigurane osobe (ugnježdene pod putovanjem + pojedinačne rute) ---
    Route::get('/travels/{travel}/insured-persons', [InsuredPersonController::class, 'index']);
    Route::post('/travels/{travel}/insured-persons', [InsuredPersonController::class, 'store']);
    Route::get('/insured-persons/{insuredPerson}', [InsuredPersonController::class, 'show']);
    Route::put('/insured-persons/{insuredPerson}', [InsuredPersonController::class, 'update']);
    Route::delete('/insured-persons/{insuredPerson}', [InsuredPersonController::class, 'destroy']);

    // --- Polise (CRUD + posebne akcije) ---
    Route::apiResource('policies', PolicyController::class);
    Route::patch('/policies/{policy}/pay', [PolicyController::class, 'pay']); // Klijent simulira plaćanje.

    // --- Akcije rezervisane za AGENT-a (i ADMIN-a) ---
    Route::middleware('role:AGENT,ADMIN')->group(function () {
        Route::patch('/policies/{policy}/approve', [PolicyController::class, 'approve']);
        Route::patch('/policies/{policy}/reject', [PolicyController::class, 'reject']);
    });

    // --- Akcije rezervisane isključivo za ADMIN-a ---
    Route::middleware('role:ADMIN')->group(function () {
        // Upravljanje korisnicima
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);

        // Upravljanje paketima osiguranja (kreiranje/izmena/brisanje)
        Route::post('/insurance-packages', [InsurancePackageController::class, 'store']);
        Route::put('/insurance-packages/{insurancePackage}', [InsurancePackageController::class, 'update']);
        Route::delete('/insurance-packages/{insurancePackage}', [InsurancePackageController::class, 'destroy']);

        // Statistika aplikacije
        Route::get('/statistics', [StatisticsController::class, 'index']);
    });
});
