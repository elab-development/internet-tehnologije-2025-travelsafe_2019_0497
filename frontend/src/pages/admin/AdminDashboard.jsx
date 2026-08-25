import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { statisticsService } from '../../services/statisticsService'
import { formatCurrency, extractErrorMessage } from '../../utils/format'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import { ErrorNotice, MetricCard, PageHeader } from '../../components/dashboard/DashboardBlocks'
import { PolicyStatusChart, RoleBreakdownChart } from '../../components/dashboard/PolicyCharts'
import { Stagger, StaggerItem } from '../../components/ui/Motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    statisticsService
      .get()
      .then(setStats)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!stats) {
    return <ErrorNotice message={error || 'Statistika nije dostupna.'} />
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Kontrola sistema"
        description="Pregled korisnika, paketa, polisa i prihoda bez ulaska u svaku administrativnu tabelu."
        meta="Admin dashboard"
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard label="Korisnici" value={stats.users_total} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Paketi" value={stats.packages_total} tone="slate" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Polise" value={stats.policies_total} tone="emerald" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Prihod aktivnih" value={formatCurrency(stats.active_revenue)} tone="amber" />
        </StaggerItem>
      </Stagger>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <Card>
          <h2 className="text-lg font-black text-slate-950">Polise po statusu</h2>
          <p className="mt-1 text-sm text-slate-500">Google Charts pregled operativnog zdravlja sistema.</p>
          <PolicyStatusChart source={stats.policies_by_status} height={280} />
        </Card>

        <Card>
          <h2 className="text-lg font-black text-slate-950">Uloge korisnika</h2>
          <p className="mt-1 text-sm text-slate-500">Odnos klijenata, agenata i administratora.</p>
          <RoleBreakdownChart stats={stats} />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { to: '/admin/users', title: 'Korisnici', text: 'Uloge i aktivacija naloga.' },
          { to: '/admin/packages', title: 'Paketi', text: 'Cene, pokrica i dostupnost.' },
          { to: '/admin/policies', title: 'Polise', text: 'Kompletan pregled sistema.' },
        ].map((item) => (
          <Link key={item.to} to={item.to}>
            <Card hover className="h-full">
              <h3 className="font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              <Button variant="secondary" className="mt-4">
                Otvori
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
