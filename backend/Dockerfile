# ---------------------------------------------------------------------------
# TravelSafe backend (Laravel 10) — najjednostavnija varijanta:
# zvanicna PHP slika + ugradjeni Laravel razvojni server (php artisan serve).
# ---------------------------------------------------------------------------
FROM php:8.2-cli

# unzip i git su potrebni Composeru za raspakivanje paketa,
# a pdo_mysql je PHP ekstenzija za rad sa MySQL bazom.
RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip default-mysql-client \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo_mysql

# Composer preuzimamo iz zvanicne Composer slike (bez rucne instalacije).
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Prvo samo composer fajlovi — Docker kesira instalaciju zavisnosti
# sve dok se composer.json/composer.lock ne promene.
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-dev --prefer-dist --no-scripts --no-autoloader

# Zatim ostatak koda aplikacije.
COPY . .
RUN composer dump-autoload --optimize \
    && chmod -R 777 storage bootstrap/cache

# Skripta koja ceka bazu, pokrece migracije i startuje server.
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["entrypoint.sh"]
