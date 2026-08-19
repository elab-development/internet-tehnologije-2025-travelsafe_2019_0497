import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { travelService } from '../../services/travelService'
import { policyService } from '../../services/policyService'
import { POLICY_STATUS } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import { Reveal, Stagger, StaggerItem } from '../../components/ui/Motion'
import { EmptyState, MetricCard, PageHeader, Timeline } from '../../components/dashboard/DashboardBlocks'
import DestinationInsight from '../../components/dashboard/DestinationInsight'
import { PolicyStatusChart } from '../../components/dashboard/PolicyCharts'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [travels, setTravels] = useState([])
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([travelService.list(), policyService.list()])
      .then(([travelList, policyList]) => {
        setTravels(travelList)
        setPolicies(policyList)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const nextTravel = useMemo(() => {
    const today = new Date()
    return [...travels]
      .filter((travel) => new Date(travel.start_date) >= today)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0]
  }, [travels])

  const activeCount = policies.filter((policy) => policy.status === POLICY_STATUS.ACTIVE).length
  const approvedCount = policies.filter((policy) => policy.status === POLICY_STATUS.APPROVED).length
  const totalValue = policies.reduce((sum, policy) => sum + Number(policy.total_price ?? 0), 0)

  const timelineSteps = [
    { title: 'Putovanje uneto', text: 'Destinacija i datumi su sacuvani.', done: travels.length > 0 },
    { title: 'Zahtev poslat', text: 'Agent proverava paket i putnike.', done: policies.length > 0 },
    { title: 'Polisa aktivna', text: 'Dokument je spreman za put.', done: activeCount > 0 },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title={`Zdravo, ${user.first_name}`}
        description="Na jednom mestu vidite putovanja, statuse polisa i kontekst destinacije pre polaska."
        action={{ to: '/travels/new', label: 'Novo putovanje' }}
        meta="Klijent portal"
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard label="Putovanja" value={travels.length} note={nextTravel ? `Sledece: ${nextTravel.destination_country}` : 'Nema zakazanog puta'} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Polise" value={policies.length} tone="slate" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Aktivne" value={activeCount} tone="emerald" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Ceka placanje" value={approvedCount} tone="amber" />
        </StaggerItem>
      </Stagger>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <Card className="h-full">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">Status polisa</h2>
                <p className="text-sm text-slate-500">Google Charts prikaz raspodele po statusima.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {formatCurrency(totalValue)}
              </span>
            </div>
            <PolicyStatusChart source={policies} />
          </Card>
        </Reveal>

        <Reveal delay={0.08}>
          <DestinationInsight country={nextTravel?.destination_country} />
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <h2 className="text-lg font-black text-slate-950">Tok pripreme</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">Kratak pregled sta je zavrseno pre puta.</p>
          <div className="mt-5">
            <Timeline steps={timelineSteps} />
          </div>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">Najnovije polise</h2>
            <Link to="/my-policies" className="text-sm font-bold text-brand-700 hover:text-brand-800">
              Prikazi sve
            </Link>
          </div>

          {policies.length === 0 ? (
            <EmptyState
              title="Jos nema polisa"
              text="Kreirajte prvo putovanje i izaberite paket osiguranja."
              action={{ to: '/travels/new', label: 'Podnesi prvi zahtev' }}
            />
          ) : (
            <div className="space-y-3">
              {policies.slice(0, 4).map((policy) => (
                <Card key={policy.id} hover className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-950">
                      {policy.travel?.destination_country} / {policy.insurance_package?.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {policy.policy_number ?? 'Broj polise jos nije dodeljen'} / {formatDate(policy.travel?.start_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge status={policy.status} />
                    <Link to={`/policies/${policy.id}`}>
                      <Button variant="secondary">Detalji</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
