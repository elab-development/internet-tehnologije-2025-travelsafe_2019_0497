import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { policyService } from '../../services/policyService'
import { POLICY_STATUS } from '../../utils/constants'
import { formatDate } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import DestinationInsight from '../../components/dashboard/DestinationInsight'
import { EmptyState, MetricCard, PageHeader } from '../../components/dashboard/DashboardBlocks'
import { PolicyStatusChart } from '../../components/dashboard/PolicyCharts'
import { Stagger, StaggerItem } from '../../components/ui/Motion'

export default function AgentDashboard() {
  const { user } = useAuth()
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    policyService
      .list()
      .then(setPolicies)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const submitted = policies.filter((policy) => policy.status === POLICY_STATUS.SUBMITTED)
  const approved = policies.filter((policy) => policy.status === POLICY_STATUS.APPROVED).length
  const active = policies.filter((policy) => policy.status === POLICY_STATUS.ACTIVE).length
  const rejected = policies.filter((policy) => policy.status === POLICY_STATUS.REJECTED).length
  const priorityPolicy = useMemo(() => submitted[0] ?? policies[0], [submitted, policies])

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
        title={`Kontrolna tabla agenta`}
        description={`Dobrodosli, ${user.first_name}. Prioritet su novi zahtevi, provera putnika i brza odluka o polisi.`}
        action={{ to: '/agent/requests', label: 'Otvori zahteve' }}
        meta="Agent workspace"
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard label="Novi zahtevi" value={submitted.length} note="Prvi za obradu" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Odobreno" value={approved} tone="amber" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Aktivne polise" value={active} tone="emerald" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Odbijeno" value={rejected} tone="red" />
        </StaggerItem>
      </Stagger>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">Red obrade</h2>
              <p className="text-sm text-slate-500">Najnoviji zahtevi koje agent treba da proveri.</p>
            </div>
            <Link to="/agent/requests" className="text-sm font-bold text-brand-700 hover:text-brand-800">
              Svi zahtevi
            </Link>
          </div>

          {submitted.length === 0 ? (
            <EmptyState title="Nema novih zahteva" text="Kada klijent podnese zahtev, pojavice se ovde." />
          ) : (
            <div className="space-y-3">
              {submitted.slice(0, 5).map((policy) => (
                <Card key={policy.id} hover className="bg-slate-50 shadow-none ring-1 ring-slate-200">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-black text-slate-950">
                        {policy.client?.first_name} {policy.client?.last_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {policy.travel?.destination_country} / {formatDate(policy.travel?.start_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={policy.status} />
                      <Link to={`/agent/policies/${policy.id}`}>
                        <Button>Obradi</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <DestinationInsight country={priorityPolicy?.travel?.destination_country} compact />
      </div>

      <Card>
        <h2 className="text-lg font-black text-slate-950">Statusi zahteva</h2>
        <p className="mt-1 text-sm text-slate-500">Operativni pregled kroz Google Charts.</p>
        <PolicyStatusChart source={policies} height={270} />
      </Card>
    </div>
  )
}
