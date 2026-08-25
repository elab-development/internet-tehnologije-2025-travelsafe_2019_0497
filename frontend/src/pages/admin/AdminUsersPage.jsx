import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { userService } from '../../services/userService'
import { ROLES } from '../../utils/constants'
import { formatDate, extractErrorMessage } from '../../utils/format'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import { ErrorNotice, MetricCard, PageHeader } from '../../components/dashboard/DashboardBlocks'

const ROLE_OPTIONS = [ROLES.CLIENT, ROLES.AGENT, ROLES.ADMIN]

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    userService
      .list()
      .then(setUsers)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const changeRole = async (id, role) => {
    try {
      const updated = await userService.updateRole(id, role)
      setUsers((list) => list.map((item) => (item.id === id ? updated : item)))
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const toggleActive = async (id) => {
    try {
      const updated = await userService.toggleActive(id)
      setUsers((list) => list.map((item) => (item.id === id ? updated : item)))
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const activeUsers = users.filter((user) => user.is_active).length
  const agents = users.filter((user) => user.role === ROLES.AGENT).length

  return (
    <div>
      <PageHeader title="Korisnici" description="Upravljanje ulogama i statusom naloga." meta="Admin" />
      <ErrorNotice message={error} />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Ukupno" value={users.length} />
        <MetricCard label="Aktivni" value={activeUsers} tone="emerald" />
        <MetricCard label="Agenti" value={agents} tone="slate" />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Korisnik</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Uloga</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Akcija</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((item) => {
              const isSelf = item.id === currentUser.id
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900">
                      {item.first_name} {item.last_name}
                    </span>
                    <span className="block text-xs text-slate-400">Registrovan: {formatDate(item.created_at)}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={item.role}
                      disabled={isSelf}
                      onChange={(event) => changeRole(item.id, event.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm disabled:bg-slate-100"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
                        item.is_active
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                          : 'bg-slate-100 text-slate-500 ring-slate-200'
                      }`}
                    >
                      {item.is_active ? 'Aktivan' : 'Deaktiviran'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant={item.is_active ? 'danger' : 'success'} disabled={isSelf} onClick={() => toggleActive(item.id)}>
                      {item.is_active ? 'Deaktiviraj' : 'Aktiviraj'}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
