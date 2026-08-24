#!/bin/sh
# Skripta koja se izvrsava pri svakom pokretanju backend kontejnera.
set -e

echo "TravelSafe: cekam MySQL na ${DB_HOST}:${DB_PORT} ..."
# Pokusavamo da otvorimo TCP konekciju ka bazi dok ne uspe.
until php -r 'exit(@fsockopen(getenv("DB_HOST"), (int) getenv("DB_PORT")) ? 0 : 1);'; do
  sleep 2
done
echo "TravelSafe: baza je dostupna."

# Ako tabela migracija jos ne postoji, baza je prazna -> posle migracija je punimo demo podacima.
if php artisan migrate:status >/dev/null 2>&1; then
  NEEDS_SEED=0
else
  NEEDS_SEED=1
fi

php artisan migrate --force

if [ "$NEEDS_SEED" = "1" ]; then
  echo "TravelSafe: prazna baza — ubacujem demo podatke."
  php artisan db:seed --force
fi

# Laravel razvojni server; --host=0.0.0.0 da bi bio dostupan izvan kontejnera.
exec php artisan serve --host=0.0.0.0 --port=8000
