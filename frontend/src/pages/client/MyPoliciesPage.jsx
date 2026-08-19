import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { policyService } from '../../services/policyService'
import { POLICY_FILTERS } from '../../utils/constants'
import { formatCurrency, formatDate, extractErrorMessage } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import { EmptyState, ErrorNotice, FilterTabs, PageHeader } from '../../components/dashboard/DashboardBlocks'
import { PolicyStatusChart } from '../../components/dashboard/PolicyCharts'

export default function MyPoliciesPage() {
  const [policies, setPolicies] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    policyService
      .list(filter)
      .then(setPolicies)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div>
      <PageHeader
        title="Moje polise"
        description="Pratite status zahteva, cenu i dokument koji ide uz svako putovanje."
      />

      <FilterTabs options={POLICY_FILTERS} value={filter} onChange={setFilter} />
      <ErrorNotice message={error} />

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner />
        </div>
      ) : policies.length === 0 ? (
        <EmptyState title="Nema polisa za izabrani filter" text="Promenite filter ili podnesite novi zahtev za putovanje." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <Card className="h-fit">
            <h2 className="text-lg font-black text-slate-950">Raspodela statusa</h2>
            <PolicyStatusChart source={policies} height={230} />
          </Card>

          <div className="space-y-3">
            {policies.map((policy) => (
              <Card key={policy.id} hover className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-black text-slate-950">
                      {policy.travel?.destination_country} / {policy.insurance_package?.name}
                    </h3>
                    <Badge status={policy.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {policy.policy_number ?? 'Broj polise jos nije dodeljen'} / {formatDate(policy.travel?.start_date)} -{' '}
                    {formatDate(policy.travel?.end_date)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-950">
                    {policy.total_price ? formatCurrency(policy.total_price) : '-'}
                  </span>
                  <Link to={`/policies/${policy.id}`}>
                    <Button variant="secondary">Detalji</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
