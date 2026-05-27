import { useState } from 'react'
import useAuthStore from '../../store/authStore'

export default function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false)
  const [authData, setAuthData] = useState({ 
    email: '', 
    password: '',
    nombre: '',
    apellido: ''
  })

  const { login, register, loading, error } = useAuthStore()

  if (!isOpen) return null

  const handleAuth = async (e) => {
    e.preventDefault()
    let success = false
    
    if (isRegister) {
      success = await register(authData.nombre, authData.apellido, authData.email, authData.password)
    } else {
      success = await login(authData.email, authData.password)
    }
    
    if (success) {
      onClose()
      setIsRegister(false)
      setAuthData({ email: '', password: '', nombre: '', apellido: '' })
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          {isRegister ? 'Crear cuenta' : 'Bienvenido de nuevo'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {isRegister ? 'Completá tus datos para unirte.' : 'Ingresá tus datos para continuar con tu compra.'}
        </p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-semibold text-gray-400 uppercase mb-1.5 ml-1">Nombre</label>
                <input 
                  type="text" 
                  required
                  placeholder="Juan"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                  value={authData.nombre}
                  onChange={e => setAuthData({...authData, nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-body font-semibold text-gray-400 uppercase mb-1.5 ml-1">Apellido</label>
                <input 
                  type="text" 
                  required
                  placeholder="Pérez"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                  value={authData.apellido}
                  onChange={e => setAuthData({...authData, apellido: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-body font-semibold text-gray-400 uppercase mb-1.5 ml-1">Email</label>
            <input 
              type="email" 
              required
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
              value={authData.email}
              onChange={e => setAuthData({...authData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold text-gray-400 uppercase mb-1.5 ml-1">Contraseña</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
              value={authData.password}
              onChange={e => setAuthData({...authData, password: e.target.value})}
            />
          </div>
          
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-2xl font-body font-bold text-base transition-all disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-400 mt-6">
          {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'} {' '}
          <span 
            className="text-brand-500 font-semibold cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Iniciá Sesión' : 'Registrate'}
          </span>
        </p>
      </div>
    </div>
  )
}
