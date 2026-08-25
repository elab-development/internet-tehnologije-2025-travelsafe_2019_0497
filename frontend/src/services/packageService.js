import api from './api'

// Servis za pakete osiguranja.
export const packageService = {
  list: () => api.get('/insurance-packages').then((r) => r.data.data),
  get: (id) => api.get(`/insurance-packages/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/insurance-packages', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/insurance-packages/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/insurance-packages/${id}`).then((r) => r.data),
}
