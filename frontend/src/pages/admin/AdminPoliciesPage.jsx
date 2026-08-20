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

export default function AdminPoliciesPage() {
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
      <PageHeader title="Sve polise" description="Administrativni pregled svih zahteva, klijenata, cena i statusa." meta="Admin" />
      <FilterTabs options={POLICY_FILTERS} value={filter} onChange={setFilter} />
      <ErrorNotice message={error} />

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner />
        </div>
      ) : policies.length === 0 ? (
        <EmptyState title="Nema polisa za izabrani filter" text="Promenite filter za siri pregled sistema." />
      ) : (
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-black text-slate-950">Trenutni presek</h2>
            <PolicyStatusChart source={policies} height={220} />
          </Card>

          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Broj polise</th>
                  <th className="px-4 py-3">Klijent</th>
                  <th className="px-4 py-3">Destinacija</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cena</th>
                  <th className="px-4 py-3 text-right">Akcija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{policy.policy_number ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {policy.client?.first_name} {policy.client?.last_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {policy.travel?.destination_country}
                      <span className="block text-xs text-slate-400">
                        {formatDate(policy.travel?.start_date)} - {formatDate(policy.travel?.end_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={policy.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {policy.total_price ? formatCurrency(policy.total_price) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/agent/policies/${policy.id}`}>
                        <Button variant="secondary">Detalji</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  )
}
