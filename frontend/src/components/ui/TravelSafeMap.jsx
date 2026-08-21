import { useEffect, useRef, useState } from 'react'
import mapMarker from '../../assets/travel/map-marker.svg'

const ARCGIS_CSS_ID = 'arcgis-js-css'
const ARCGIS_SCRIPT_ID = 'arcgis-js-api'
const ARCGIS_CSS_URL = 'https://js.arcgis.com/4.32/esri/themes/dark/main.css'
const ARCGIS_SCRIPT_URL = 'https://js.arcgis.com/4.32/'
const TRAVEL_SAFE_LAYER_ID = '6f157d1d00724b899da1d62a313f8ca4'
const TRAVEL_SAFE_PORTAL_URL = 'https://sigcfe.maps.arcgis.com'
const DEFAULT_ZOOM = 5

let arcGisLoaderPromise

function loadArcGisApi() {
  if (window.require) {
    return Promise.resolve(window.require)
  }

  if (arcGisLoaderPromise) {
    return arcGisLoaderPromise
  }

  arcGisLoaderPromise = new Promise((resolve, reject) => {
    if (!document.getElementById(ARCGIS_CSS_ID)) {
      const link = document.createElement('link')
      link.id = ARCGIS_CSS_ID
      link.rel = 'stylesheet'
      link.href = ARCGIS_CSS_URL
      document.head.appendChild(link)
    }

    const existingScript = document.getElementById(ARCGIS_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.require), { once: true })
      existingScript.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = ARCGIS_SCRIPT_ID
    script.src = ARCGIS_SCRIPT_URL
    script.async = true
    script.onload = () => resolve(window.require)
    script.onerror = reject
    document.body.appendChild(script)
  })

  return arcGisLoaderPromise
}

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export default function TravelSafeMap({
  lat = 44.8176,
  lon = 20.4633,
  label = 'Mapa destinacije',
  className = '',
  zoom = DEFAULT_ZOOM,
}) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const [hasError, setHasError] = useState(false)
  const latitude = toNumber(lat, 44.8176)
  const longitude = toNumber(lon, 20.4633)
  const sizeClass = className || 'h-64'

  useEffect(() => {
    let isCanceled = false

    setHasError(false)

    loadArcGisApi()
      .then(
        (require) =>
          new Promise((resolve, reject) => {
            require(
              ['esri/Map', 'esri/views/MapView', 'esri/layers/VectorTileLayer', 'esri/Graphic', 'esri/portal/Portal'],
              (ArcGisMap, MapView, VectorTileLayer, Graphic, Portal) => {
                resolve({ ArcGisMap, MapView, VectorTileLayer, Graphic, Portal })
              },
              reject,
            )
          }),
      )
      .then(({ ArcGisMap, MapView, VectorTileLayer, Graphic, Portal }) => {
        if (isCanceled || !containerRef.current) {
          return
        }

        const layer = new VectorTileLayer({
          portalItem: {
            id: TRAVEL_SAFE_LAYER_ID,
            portal: new Portal({
              url: TRAVEL_SAFE_PORTAL_URL,
            }),
          },
        })

        const map = new ArcGisMap({
          layers: [layer],
        })

        const view = new MapView({
          container: containerRef.current,
          map,
          center: [longitude, latitude],
          zoom,
          constraints: {
            rotationEnabled: false,
          },
          ui: {
            components: [],
          },
        })

        viewRef.current = view

        view.when(() => {
          if (isCanceled) {
            return
          }

          // Marker je SVG asset aplikacije, a pozicija dolazi iz podataka o destinaciji.
          view.graphics.removeAll()
          view.graphics.add(
            new Graphic({
              geometry: {
                type: 'point',
                longitude,
                latitude,
              },
              symbol: {
                type: 'picture-marker',
                url: mapMarker,
                width: '42px',
                height: '56px',
                yoffset: '22px',
              },
            }),
          )
        }, setHasError)
      })
      .catch(() => setHasError(true))

    return () => {
      isCanceled = true

      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [latitude, longitude, zoom])

  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl bg-[#0f1720] shadow-soft ring-1 ring-slate-200 ${sizeClass}`}
      aria-label={label}
      role="img"
    >
      <div ref={containerRef} className="h-full w-full [&_.esri-view-surface]:outline-none" />

      {hasError && (
        <div className="absolute inset-0 grid place-items-center bg-slate-950 px-5 text-center text-sm font-semibold text-white">
          Mapa trenutno nije dostupna.
        </div>
      )}
    </div>
  )
}
