import api from './api'

// Servis za putovanja.
export const travelService = {
  list: () => api.get('/travels').then((r) => r.data.data),
  get: (id) => api.get(`/travels/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/travels', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/travels/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/travels/${id}`).then((r) => r.data),
}
