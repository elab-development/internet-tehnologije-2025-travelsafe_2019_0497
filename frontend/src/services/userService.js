import api from './api'

// Servis za administraciju korisnika (dostupno samo ADMIN ulozi).
export const userService = {
  list: () => api.get('/users').then((r) => r.data.data),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }).then((r) => r.data.data),
  toggleActive: (id) => api.patch(`/users/${id}/toggle-active`).then((r) => r.data.data),
}
