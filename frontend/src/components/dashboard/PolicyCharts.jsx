import GoogleChart from '../ui/GoogleChart'
import { buildStatusRows } from '../../utils/policyChartData'

export function PolicyStatusChart({ source, height = 250 }) {
  const rows = buildStatusRows(source)

  if (rows.length === 1) {
    return <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">Nema dovoljno podataka za grafikon.</p>
  }

  return (
    <GoogleChart
      type="ColumnChart"
      data={rows}
      height={height}
      options={{
        colors: rows.slice(1).map((row) => row[2]),
        hAxis: { textStyle: { color: '#64748b', fontSize: 11 } },
        vAxis: { minValue: 0, gridlines: { color: '#e2e8f0' }, textStyle: { color: '#64748b' } },
        legend: { position: 'none' },
      }}
    />
  )
}

export function RoleBreakdownChart({ stats }) {
  const rows = [
    ['Uloga', 'Broj'],
    ['Klijenti', Number(stats.clients_total ?? 0)],
    ['Agenti', Number(stats.agents_total ?? 0)],
    ['Admini', Math.max(Number(stats.users_total ?? 0) - Number(stats.clients_total ?? 0) - Number(stats.agents_total ?? 0), 0)],
  ]

  return (
    <GoogleChart
      type="PieChart"
      data={rows}
      options={{
        pieHole: 0.58,
        colors: ['#2563eb', '#14b8a6', '#f9735b'],
        pieSliceText: 'none',
      }}
    />
  )
}
