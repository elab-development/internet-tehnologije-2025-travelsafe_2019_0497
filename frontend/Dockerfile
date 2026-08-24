# ---------------------------------------------------------------------------
# TravelSafe frontend (React + Create React App)
# Faza 1: build statickih fajlova. Faza 2: serviranje kroz nginx.
# ---------------------------------------------------------------------------

# --- Faza 1: build ---
FROM node:24-alpine AS build

WORKDIR /app

# Prvo samo package fajlovi — Docker kesira "npm ci" dok se zavisnosti ne promene.
COPY package.json package-lock.json ./
RUN npm ci

# Adresa API-ja se ugradjuje u build, jer CRA cita REACT_APP_* promenljive
# u trenutku build-a, a ne pri pokretanju. Menja se u docker-compose.yml.
ARG REACT_APP_API_URL=http://localhost:8000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY . .
RUN npm run build

# --- Faza 2: serviranje ---
FROM nginx:alpine

# Podesavanje koje resava React Router putanje (SPA fallback).
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Rezultat build-a iz prve faze postaje sadrzaj web servera.
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
