import { ROLES } from './constants'

export function dashboardPath(role) {
  if (role === ROLES.ADMIN) return '/admin/dashboard'
  if (role === ROLES.AGENT) return '/agent/dashboard'
  return '/client/dashboard'
}
