#!/bin/sh
# Skripta koja se izvrsava pri svakom pokretanju backend kontejnera.
set -e

echo "TravelSafe: cekam MySQL na ${DB_HOST}:${DB_PORT} ..."

# Ako je DB_PASSWORD prazan, mysqladmin se poziva bez prekidaca -p.
# --skip-ssl je neophodan jer MySQL 8 koristi self-signed sertifikat,
# koji MariaDB klijent podrazumevano odbija.
if [ -z "${DB_PASSWORD}" ]; then
  until mysqladmin ping --skip-ssl -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USERNAME}" --silent; do
    sleep 2
  done
else
  until mysqladmin ping --skip-ssl -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --silent; do
    sleep 2
  done
fi

echo "TravelSafe: baza je dostupna."

# .env unutar kontejnera (ako fali, kopira se primer).
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Upisuje ili menja jedan kljuc u .env fajlu.
set_env() {
  if grep -q "^${1}=" .env; then
    sed -i "s|^${1}=.*|${1}=${2}|" .env
  else
    echo "${1}=${2}" >> .env
  fi
}

# Vrednosti iz docker-compose.yml upisujemo u .env. Laravel razvojni server
# detetu procesu prosledjuje samo ogranicen skup promenljivih kada .env postoji,
# pa bi bez ovog koraka server citao podrazumevani DB_HOST=127.0.0.1.
set_env DB_CONNECTION "${DB_CONNECTION}"
set_env DB_HOST "${DB_HOST}"
set_env DB_PORT "${DB_PORT}"
set_env DB_DATABASE "${DB_DATABASE}"
set_env DB_USERNAME "${DB_USERNAME}"
set_env DB_PASSWORD "${DB_PASSWORD}"
set_env APP_URL "${APP_URL}"
set_env FRONTEND_URL "${FRONTEND_URL}"
set_env CORS_ALLOWED_ORIGINS "${CORS_ALLOWED_ORIGINS}"

# Ciscenje kesa da u kontejneru ne ostane konfiguracija sa prethodnog pokretanja.
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# APP_KEY
php artisan key:generate --force || true

# Migracije + seed pri svakom pokretanju: baza se vraca na poznato demo stanje.
php artisan migrate:fresh --seed --force

# Laravel razvojni server; --host=0.0.0.0 da bi bio dostupan izvan kontejnera.
exec php artisan serve --host=0.0.0.0 --port=8000
