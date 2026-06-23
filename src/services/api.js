/**
 * Cliente HTTP centralizado para comunicación con la API de Virtual Pet.
 * Adjunta el JWT automáticamente en cada request autenticado.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('vp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vp_token')
      localStorage.removeItem('vp_user')
      import('../store/authStore')
        .then(m => {
          m.default.getState().logout()
        })
        .catch(err => console.error('Failed to log out from authStore:', err))
    }
    return Promise.reject(error)
  }
)

export default api
