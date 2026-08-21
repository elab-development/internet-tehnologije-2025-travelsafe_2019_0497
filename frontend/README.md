# TravelSafe — frontend (React + Create React App)

React 19 SPA napravljena nad **Create React App** (`react-scripts` 5), sa React Routerom, Axiosom i Tailwind CSS-om.

## Skripte

| Komanda | Opis |
|---------|------|
| `npm start` | Razvojni server sa hot reload-om na `http://localhost:3000` |
| `npm run dev` | Alias za `npm start` |
| `npm run build` | Produkcijski build u folder `build/` |
| `npm test` | Jest test runner (CRA podrazumevani) |
| `npm run lint` | Oxlint provera koda |

## Promenljive okruženja

CRA učitava samo promenljive koje počinju sa `REACT_APP_`. Definisane su u fajlu `.env`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

U kodu im se pristupa preko `process.env.REACT_APP_API_URL` (vidi `src/services/api.js`).

> Nakon izmene `.env` fajla treba restartovati razvojni server.

## Struktura

```
public/            # index.html (HTML ljuska) + statičke ikonice
src/
├── index.jsx      # ulazna tačka (CRA je traži kao src/index.*)
├── App.jsx        # definicija ruta
├── components/    # ui/ + layout/ + dashboard/
├── pages/         # javne + client/ + agent/ + admin/ stranice
├── services/      # Axios servisi po resursu (api.js + *Service.js)
├── context/       # AuthContext (prijavljeni korisnik)
├── hooks/         # useAuth
├── routes/        # ProtectedRoute (zaštita ruta po ulozi)
└── utils/         # constants.js, format.js
```

## Tailwind CSS

CRA automatski uključuje Tailwind kada u korenu projekta postoji `tailwind.config.js`
(zato zaseban `postcss.config.js` nije potreban). Konfiguracija je u CommonJS formatu.
