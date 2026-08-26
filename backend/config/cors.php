<?php

/*
|--------------------------------------------------------------------------
| CORS (Cross-Origin Resource Sharing) zaštita
|--------------------------------------------------------------------------
|
| React aplikacija i Laravel API rade na različitim adresama (npr. :3000 i :8000),
| pa je svaki poziv iz browsera "cross-origin". Pre pravog zahteva browser šalje
| preflight zahtev (metoda OPTIONS) i pita server sme li da pošalje pravi zahtev.
|
| Na taj preflight odgovara globalni middleware Illuminate\Http\Middleware\HandleCors,
| registrovan u app/Http/Kernel.php, a pravila čita iz ovog fajla.
|
| Zaštita znači da su origin-i, metode i zaglavlja EKSPLICITNO nabrojani,
| zahtev sa bilo koje druge adrese browser odbija.
|
*/

// Dozvoljene adrese se podešavaju u .env fajlu (razdvojene zarezom), npr:
// CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
$configuredOrigins = array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000'))
);

// FRONTEND_URL se dodaje na listu da ne bi morao dva puta da se upisuje.
// APP_URL se dodaje zato sto Swagger UI stranicu servira sam API, pa pozivi iz
// nje polaze sa adrese backenda, a ne sa adrese React aplikacije.
$allowedOrigins = array_values(array_unique(array_filter(
    array_merge([env('FRONTEND_URL'), env('APP_URL')], $configuredOrigins)
)));

return [

    // Rute na koje se CORS pravila primenjuju (samo API, ne i statički fajlovi).
    'paths' => ['api/*'],

    // Dozvoljene HTTP metode, tačno one koje aplikacija zaista koristi.
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Dozvoljeni origin-i (adresa frontenda). Sve ostalo browser blokira.
    'allowed_origins' => $allowedOrigins,

    // Create React App uzima sledeci slobodan port, pa dozvoljavamo localhost/127.0.0.1 na 3000-3009.
    // Port 8000 je adresa samog API-ja, sa koje se otvara Swagger UI stranica; pregledac
    // adrese "localhost" i "127.0.0.1" smatra razlicitim izvorima, pa su navedene obe.
    'allowed_origins_patterns' => [
        '#^http://(localhost|127\.0\.0\.1):300[0-9]$#',
        '#^http://(localhost|127\.0\.0\.1):8000$#',
    ],

    // Dozvoljena zaglavlja koja frontend sme da pošalje (Authorization nosi Sanctum token).
    'allowed_headers' => ['Accept', 'Authorization', 'Content-Type', 'Origin', 'X-Requested-With'],

    // Zaglavlja koja browser sme da pročita iz odgovora (nema potrebe ni za jednim).
    'exposed_headers' => [],

    // Koliko sekundi browser sme da kešira rezultat preflight zahteva (1 sat).
    'max_age' => 3600,

    // Aplikacija koristi Bearer token iz localStorage, a ne cookie sesije,
    // pa slanje kolačića kroz CORS nije potrebno (i sigurnije je da bude isključeno).
    'supports_credentials' => false,

];
