import { STATUS_META } from './constants'

export const STATUS_COLORS = {
  SUBMITTED: '#2563eb',
  UNDER_REVIEW: '#4f46e5',
  APPROVED: '#d97706',
  REJECTED: '#dc2626',
  PAYMENT_PENDING: '#f59e0b',
  ACTIVE: '#059669',
  EXPIRED: '#64748b',
}

export function buildStatusRows(source) {
  const counts = Array.isArray(source)
    ? source.reduce((items, policy) => {
        items[policy.status] = (items[policy.status] ?? 0) + 1
        return items
      }, {})
    : source ?? {}

  const rows = Object.entries(counts)
    .filter(([, count]) => Number(count) > 0)
    .map(([status, count]) => [STATUS_META[status]?.label ?? status, Number(count), STATUS_COLORS[status] ?? '#94a3b8'])

  return [['Status', 'Broj', { role: 'style' }], ...rows]
}
