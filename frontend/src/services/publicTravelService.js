const countryCache = new Map()
const weatherCache = new Map()

const KNOWN_DESTINATIONS = {
  austria: { name: 'Austria', localName: 'Austrija', capital: 'Vienna', region: 'Europe', lat: 47.5162, lon: 14.5501 },
  austrija: { name: 'Austria', localName: 'Austrija', capital: 'Vienna', region: 'Europe', lat: 47.5162, lon: 14.5501 },
  bec: { name: 'Austria', localName: 'Austrija', capital: 'Vienna', region: 'Europe', lat: 48.2082, lon: 16.3738 },
  vienna: { name: 'Austria', localName: 'Austrija', capital: 'Vienna', region: 'Europe', lat: 48.2082, lon: 16.3738 },
  france: { name: 'France', localName: 'Francuska', capital: 'Paris', region: 'Europe', lat: 46.2276, lon: 2.2137 },
  francuska: { name: 'France', localName: 'Francuska', capital: 'Paris', region: 'Europe', lat: 46.2276, lon: 2.2137 },
  germany: { name: 'Germany', localName: 'Nemacka', capital: 'Berlin', region: 'Europe', lat: 51.1657, lon: 10.4515 },
  nemacka: { name: 'Germany', localName: 'Nemacka', capital: 'Berlin', region: 'Europe', lat: 51.1657, lon: 10.4515 },
  greece: { name: 'Greece', localName: 'Grcka', capital: 'Athens', region: 'Europe', lat: 39.0742, lon: 21.8243 },
  grcka: { name: 'Greece', localName: 'Grcka', capital: 'Athens', region: 'Europe', lat: 39.0742, lon: 21.8243 },
  athens: { name: 'Greece', localName: 'Grcka', capital: 'Athens', region: 'Europe', lat: 37.9838, lon: 23.7275 },
  atina: { name: 'Greece', localName: 'Grcka', capital: 'Athens', region: 'Europe', lat: 37.9838, lon: 23.7275 },
  italy: { name: 'Italy', localName: 'Italija', capital: 'Rome', region: 'Europe', lat: 41.8719, lon: 12.5674 },
  italija: { name: 'Italy', localName: 'Italija', capital: 'Rome', region: 'Europe', lat: 41.8719, lon: 12.5674 },
  rome: { name: 'Italy', localName: 'Italija', capital: 'Rome', region: 'Europe', lat: 41.9028, lon: 12.4964 },
  rim: { name: 'Italy', localName: 'Italija', capital: 'Rome', region: 'Europe', lat: 41.9028, lon: 12.4964 },
  serbia: { name: 'Serbia', localName: 'Srbija', capital: 'Belgrade', region: 'Europe', lat: 44.0165, lon: 21.0059 },
  srbija: { name: 'Serbia', localName: 'Srbija', capital: 'Belgrade', region: 'Europe', lat: 44.0165, lon: 21.0059 },
  spain: { name: 'Spain', localName: 'Spanija', capital: 'Madrid', region: 'Europe', lat: 40.4637, lon: -3.7492 },
  spanija: { name: 'Spain', localName: 'Spanija', capital: 'Madrid', region: 'Europe', lat: 40.4637, lon: -3.7492 },
  turkey: { name: 'Turkey', localName: 'Turska', capital: 'Ankara', region: 'Europe / Asia', lat: 38.9637, lon: 35.2433 },
  turska: { name: 'Turkey', localName: 'Turska', capital: 'Ankara', region: 'Europe / Asia', lat: 38.9637, lon: 35.2433 },
  usa: { name: 'United States', localName: 'SAD', capital: 'Washington, D.C.', region: 'North America', lat: 39.8283, lon: -98.5795 },
  sad: { name: 'United States', localName: 'SAD', capital: 'Washington, D.C.', region: 'North America', lat: 39.8283, lon: -98.5795 },
  'united states': { name: 'United States', localName: 'SAD', capital: 'Washington, D.C.', region: 'North America', lat: 39.8283, lon: -98.5795 },
  'sjedinjene americke drzave': { name: 'United States', localName: 'SAD', capital: 'Washington, D.C.', region: 'North America', lat: 39.8283, lon: -98.5795 },
}

function normalizeDestination(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function destinationKey(value) {
  return normalizeDestination(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'dj')
}

function getKnownProfile(country) {
  const profile = KNOWN_DESTINATIONS[destinationKey(country)]
  return profile ? { ...profile, source: 'known-destination' } : null
}

function getFallbackProfile(country) {
  return {
    name: normalizeDestination(country),
    localName: normalizeDestination(country),
    capital: 'Nije dostupno',
    region: 'Destinacija',
    lat: 44.8176,
    lon: 20.4633,
    source: 'fallback',
  }
}

async function fetchJson(url) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      throw new Error('Public travel data is not available.')
    }

    return response.json()
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function buildProfileFromGeocoding(place, originalDestination) {
  return {
    name: place.country ?? place.name ?? originalDestination,
    localName: place.name ?? place.country ?? originalDestination,
    capital: place.admin1 ?? place.name ?? 'Nije dostupno',
    region: [place.country, place.admin1, place.timezone].filter(Boolean).join(' / ') || 'Destinacija',
    lat: Number(place.latitude),
    lon: Number(place.longitude),
    source: 'open-meteo-geocoding',
  }
}

function chooseBestGeocodingResult(results) {
  if (!results?.length) return null

  // Drzave imaju PCLI/PCLIX kod; to sprecava slucaj "Greece, New York".
  return (
    results.find((place) => ['PCLI', 'PCLIX'].includes(place.feature_code)) ??
    [...results].sort((a, b) => Number(b.population ?? 0) - Number(a.population ?? 0))[0]
  )
}

export async function getCountryProfile(country) {
  const normalized = normalizeDestination(country)
  const key = destinationKey(country)

  if (normalized.length < 3) return null
  if (countryCache.has(key)) return countryCache.get(key)

  const knownProfile = getKnownProfile(normalized)
  if (knownProfile) {
    countryCache.set(key, knownProfile)
    return knownProfile
  }

  const params = new URLSearchParams({
    name: normalized,
    count: '10',
    language: 'sr',
    format: 'json',
  })

  try {
    // Open-Meteo Geocoding radi bez API kljuca i ima browser CORS podrsku.
    const data = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`)
    const bestPlace = chooseBestGeocodingResult(data?.results)
    const profile = bestPlace ? buildProfileFromGeocoding(bestPlace, normalized) : getFallbackProfile(normalized)

    countryCache.set(key, profile)
    return profile
  } catch {
    const fallback = getFallbackProfile(normalized)
    countryCache.set(key, fallback)
    return fallback
  }
}

export async function getWeatherSummary(lat, lon) {
  const roundedLat = Number(lat).toFixed(2)
  const roundedLon = Number(lon).toFixed(2)
  const key = `${roundedLat},${roundedLon}`

  if (weatherCache.has(key)) return weatherCache.get(key)

  const params = new URLSearchParams({
    latitude: roundedLat,
    longitude: roundedLon,
    current: 'temperature_2m,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '3',
    timezone: 'auto',
  })

  // Open-Meteo vraca vremenski kontekst bez API kljuca.
  const data = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
  const summary = {
    temperature: data.current?.temperature_2m,
    wind: data.current?.wind_speed_10m,
    code: data.current?.weather_code,
    precipitation: data.daily?.precipitation_probability_max?.[0],
    high: data.daily?.temperature_2m_max?.[0],
    low: data.daily?.temperature_2m_min?.[0],
    source: 'open-meteo',
  }

  weatherCache.set(key, summary)
  return summary
}

export async function getDestinationInsight(country) {
  const profile = await getCountryProfile(country)
  if (!profile) return null

  try {
    const weather = await getWeatherSummary(profile.lat, profile.lon)
    return { profile, weather }
  } catch {
    return { profile, weather: null }
  }
}
