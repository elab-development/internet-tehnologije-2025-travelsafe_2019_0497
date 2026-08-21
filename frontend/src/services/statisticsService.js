import api from './api'

// Servis za statistiku aplikacije (ADMIN kontrolna tabla).
export const statisticsService = {
  get: () => api.get('/statistics').then((r) => r.data.data),
}
