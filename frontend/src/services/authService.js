import api from './api'

// Servis za autentifikaciju. Svaki poziv vraća "data" deo iz JSON omotača { success, message, data }.
export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data.data),
}
