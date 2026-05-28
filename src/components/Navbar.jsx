import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, PawPrint, LogOut, User as UserIcon } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'

export default function Navbar({ onCartClick, onLoginClick, onLogout }) {
  const { user, isLoggedIn } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { cantidadItems } = useCartStore()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Logo — Link hacia el inicio */}
        <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <PawPrint size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-gray-900">
            Virtual<span className="text-brand-500">Pet</span>
          </span>
        </Link>

        {/* Slogan — oculto en móvil */}
        <p className="hidden md:block text-sm text-black-400 font-body">
          Virtual Pet nunca defraudará a su mascota
        </p>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {isLoggedIn() ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pr-3 hover:bg-surface-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-surface-200 rounded-lg flex items-center justify-center text-gray-600 shrink-0">
                  <UserIcon size={16} />
                </div>
                <div className="flex flex-col items-start leading-none hidden sm:flex">
                  <span className="text-sm font-body font-medium text-gray-700">{user?.nombre}</span>
                  {user?.role === 'admin' && <span className="text-[9px] font-bold text-brand-600 uppercase mt-0.5">Admin</span>}
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-surface-200 rounded-xl shadow-xl py-2 z-50">
                  <Link 
                    to="/mi-cuenta"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-surface-50 transition-colors font-body"
                  >
                    <UserIcon size={16} />
                    Mi Perfil
                  </Link>
                  <div className="h-px bg-surface-100 my-1 mx-2" />
                  <button 
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-body"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="text-sm font-body font-medium text-gray-600 hover:text-brand-500 px-3 py-2 transition-colors"
            >
              Iniciar sesión
            </button>
          )}

          {/* Carrito */}
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl transition-colors font-body font-medium text-sm"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Carrito</span>
            {cantidadItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-mono">
                {cantidadItems()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
