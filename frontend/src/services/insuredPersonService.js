import api from './api'

// Servis za osigurane osobe (ugnježdene pod putovanjem).
export const insuredPersonService = {
  listByTravel: (travelId) => api.get(`/travels/${travelId}/insured-persons`).then((r) => r.data.data),
  add: (travelId, payload) => api.post(`/travels/${travelId}/insured-persons`, payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/insured-persons/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/insured-persons/${id}`).then((r) => r.data),
}
