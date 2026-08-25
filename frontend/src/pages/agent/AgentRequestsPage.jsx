import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { policyService } from '../../services/policyService'
import { POLICY_FILTERS } from '../../utils/constants'
import { formatDate, extractErrorMessage } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import { EmptyState, ErrorNotice, FilterTabs, PageHeader } from '../../components/dashboard/DashboardBlocks'

export default function AgentRequestsPage() {
  const [policies, setPolicies] = useState([])
  const [filter, setFilter] = useState('SUBMITTED')
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
        title="Zahtevi za osiguranje"
        description="Queue za proveru klijenta, destinacije, paketa i konacne cene."
        meta="Agent obrada"
      />

      <FilterTabs options={POLICY_FILTERS} value={filter} onChange={setFilter} />
      <ErrorNotice message={error} />

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner />
        </div>
      ) : policies.length === 0 ? (
        <EmptyState title="Nema zahteva za izabrani filter" text="Promenite filter ili sacekajte novi zahtev klijenta." />
      ) : (
        <div className="grid gap-4">
          {policies.map((policy) => (
            <Card key={policy.id} hover className="grid gap-4 lg:grid-cols-[1fr_14rem] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-black text-slate-950">
                    {policy.client?.first_name} {policy.client?.last_name}
                  </h3>
                  <Badge status={policy.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {policy.travel?.destination_country} / {policy.insurance_package?.name} /{' '}
                  {formatDate(policy.travel?.start_date)} - {formatDate(policy.travel?.end_date)}
                </p>
              </div>
              <Link to={`/agent/policies/${policy.id}`} className="lg:justify-self-end">
                <Button>{policy.status === 'SUBMITTED' ? 'Obradi' : 'Detalji'}</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
