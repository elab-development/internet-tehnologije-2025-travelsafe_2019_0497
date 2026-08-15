import axios from 'axios'

// Zajednicka Axios instanca za komunikaciju sa Laravel API-jem.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Interceptor zahteva automatski dodaje Sanctum token ako postoji.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Interceptor odgovora brise lokalni token kada backend vrati 401.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }

    return Promise.reject(error)
  },
)

export default api
