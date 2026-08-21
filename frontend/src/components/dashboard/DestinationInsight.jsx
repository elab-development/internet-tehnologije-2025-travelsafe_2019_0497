import { useEffect, useState } from 'react'
import Card from '../ui/Card'
import TravelSafeMap from '../ui/TravelSafeMap'
import { getDestinationInsight } from '../../services/publicTravelService'

function describeWeather(code) {
  if (code === undefined || code === null) return 'Nema prognoze'
  if (code === 0) return 'Vedro'
  if (code <= 3) return 'Promenljivo'
  if (code <= 67) return 'Kisa'
  if (code <= 77) return 'Sneg'
  return 'Nestabilno'
}

export default function DestinationInsight({ country, compact = false }) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const normalized = country?.trim()

    if (!normalized) {
      setInsight(null)
      setFailed(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setLoading(true)
      setFailed(false)
      getDestinationInsight(normalized)
        .then(setInsight)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false))
    }, 450)

    return () => window.clearTimeout(timeoutId)
  }, [country])

  if (!country?.trim()) {
    return (
      <Card className="h-full">
        <p className="text-sm font-semibold text-slate-950">Kontekst destinacije</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Unesite zemlju destinacije da se prikazu mapa, osnovni podaci i vremenski uslovi.
        </p>
      </Card>
    )
  }

  if (failed) {
    return (
      <Card className="h-full">
        <p className="text-sm font-semibold text-slate-950">Kontekst destinacije</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Javni servisi za destinaciju trenutno nisu dostupni. Zahtev mozete nastaviti.
        </p>
      </Card>
    )
  }

  if (loading || !insight) {
    return (
      <Card className="h-full animate-pulse">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="mt-4 h-40 rounded-xl bg-slate-100" />
      </Card>
    )
  }

  const { profile, weather } = insight

  return (
    <Card className="p-0">
      <TravelSafeMap lat={profile.lat} lon={profile.lon} label={`Mapa: ${profile.name}`} className={compact ? 'h-40' : 'h-64'} />
      <div className={compact ? 'p-4' : 'p-5'}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-black text-slate-950">
              {profile.flag} {profile.localName ?? profile.name}
            </p>
            <p className="text-sm text-slate-500">{profile.region || 'Region nije dostupan'}</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
            {profile.source === 'open-meteo-geocoding' ? 'Live podaci' : 'Pouzdana lokacija'}
          </span>
        </div>

        <dl className={`grid grid-cols-2 gap-3 text-sm ${compact ? 'mt-3' : 'mt-4'}`}>
          <div>
            <dt className="text-slate-400">Tacka mape</dt>
            <dd className="font-semibold text-slate-800">{profile.capital}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Koordinate</dt>
            <dd className="font-semibold text-slate-800">
              {Number(profile.lat).toFixed(1)}, {Number(profile.lon).toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Vreme</dt>
            <dd className="font-semibold text-slate-800">{describeWeather(weather?.code)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Temperatura</dt>
            <dd className="font-semibold text-slate-800">
              {weather?.temperature ?? weather?.high ?? '-'} C
            </dd>
          </div>
        </dl>
        {!compact && <p className="mt-4 text-xs leading-5 text-slate-400">Geokodiranje i vreme koriste Open-Meteo javne servise.</p>}
      </div>
    </Card>
  )
}
