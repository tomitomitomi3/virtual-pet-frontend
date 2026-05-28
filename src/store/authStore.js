import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('vp_user')) || null,
  token: localStorage.getItem('vp_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token } = response.data
      
      localStorage.setItem('vp_token', access_token)
      
      // Obtener el perfil completo para tener el campo 'role'
      const userResponse = await api.get('/auth/me')
      const user = userResponse.data
      
      localStorage.setItem('vp_user', JSON.stringify(user))
      
      set({ token: access_token, user, loading: false })
      return true
    } catch (err) {
      set({ 
        error: err.response?.data?.detail || 'Error al iniciar sesión', 
        loading: false 
      })
      return false
    }
  },

  register: async (nombre, apellido, email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/register', { nombre, apellido, email, password })
      const { access_token, user } = response.data
      
      localStorage.setItem('vp_token', access_token)
      localStorage.setItem('vp_user', JSON.stringify(user))
      
      set({ token: access_token, user, loading: false })
      return true
    } catch (err) {
      const detail = err.response?.data?.detail
      let errorMessage = 'Error al registrarse'
      
      if (Array.isArray(detail)) {
        errorMessage = detail[0].msg
      } else if (typeof detail === 'string') {
        errorMessage = detail
      }

      set({ 
        error: errorMessage, 
        loading: false 
      })
      return false
    }
  },

  updateProfile: async (nombre, apellido) => {
    set({ loading: true, error: null })
    try {
      const response = await api.patch('/auth/me', { nombre, apellido })
      const updatedUser = response.data
      
      localStorage.setItem('vp_user', JSON.stringify(updatedUser))
      set({ user: updatedUser, loading: false })
      return true
    } catch (err) {
      set({ 
        error: err.response?.data?.detail || 'Error al actualizar perfil', 
        loading: false 
      })
      return false
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null })
    try {
      await api.patch('/auth/me/password', { 
        current_password: currentPassword, 
        new_password: newPassword 
      })
      set({ loading: false })
      return true
    } catch (err) {
      set({ 
        error: err.response?.data?.detail || 'Error al cambiar contraseña', 
        loading: false 
      })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('vp_token')
    localStorage.removeItem('vp_user')
    set({ user: null, token: null })
  },

  isLoggedIn: () => !!localStorage.getItem('vp_token')
}))

export default useAuthStore
