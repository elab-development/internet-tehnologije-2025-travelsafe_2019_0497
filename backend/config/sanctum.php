<?php

use Laravel\Sanctum\Sanctum;

return [
    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Projekat koristi Bearer tokene iz React aplikacije. Stateful domeni ostaju
    | podesivi zbog Sanctum konfiguracije, ali API middleware ne koristi cookie
    | sesije ni CSRF tok.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,localhost:3001,127.0.0.1,127.0.0.1:3000,127.0.0.1:3001,::1',
        Sanctum::currentApplicationUrlWithPort()
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | Ako guard ne autentifikuje zahtev, Sanctum koristi Bearer token iz
    | Authorization header-a. To je tok koji koristi frontend.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | Cookie/CSRF middleware nije potreban jer frontend salje Bearer token.
    |
    */

    'middleware' => [],
];
