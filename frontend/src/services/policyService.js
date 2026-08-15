import api from './api'

// Servis za polise (CRUD + posebne akcije: odobri, odbij, plati).
export const policyService = {
  // status je opcioni filter; 'ALL' se tretira kao "bez filtera".
  list: (status) =>
    api
      .get('/policies', { params: status && status !== 'ALL' ? { status } : {} })
      .then((r) => r.data.data),
  get: (id) => api.get(`/policies/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/policies', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/policies/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/policies/${id}`).then((r) => r.data),
  approve: (id, totalPrice) =>
    api.patch(`/policies/${id}/approve`, { total_price: totalPrice }).then((r) => r.data.data),
  reject: (id, reason) =>
    api.patch(`/policies/${id}/reject`, { rejection_reason: reason }).then((r) => r.data.data),
  pay: (id) => api.patch(`/policies/${id}/pay`).then((r) => r.data.data),
}
