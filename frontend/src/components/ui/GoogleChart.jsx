import { useEffect, useRef, useState } from 'react'

let chartsPromise

function loadGoogleCharts() {
  if (window.google?.charts) {
    return Promise.resolve(window.google)
  }

  if (chartsPromise) return chartsPromise

  chartsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/charts/loader.js'
    script.async = true
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart', 'bar'] })
      window.google.charts.setOnLoadCallback(() => resolve(window.google))
    }
    script.onerror = reject
    document.head.appendChild(script)
  })

  return chartsPromise
}

export default function GoogleChart({ type = 'PieChart', data, options = {}, height = 260 }) {
  const containerRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadGoogleCharts()
      .then((google) => {
        if (cancelled || !containerRef.current) return

        const chartData = google.visualization.arrayToDataTable(data)
        const ChartConstructor = google.visualization[type]
        const chart = new ChartConstructor(containerRef.current)
        chart.draw(chartData, {
          backgroundColor: 'transparent',
          chartArea: { width: '86%', height: '78%' },
          fontName: 'IBM Plex Sans',
          legend: { position: 'bottom', textStyle: { color: '#475569', fontSize: 12 } },
          ...options,
        })
      })
      .catch(() => setFailed(true))

    return () => {
      cancelled = true
    }
  }, [data, options, type])

  if (failed) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500" style={{ minHeight: height }}>
        Google Charts trenutno nije dostupan.
      </div>
    )
  }

  return <div ref={containerRef} className="w-full" style={{ height }} aria-label="Graficki prikaz podataka" />
}
