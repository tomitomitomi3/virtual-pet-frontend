/**
 * CatalogoPage — página principal de la tienda Virtual Pet.
 *
 * Layout: navbar superior + sidebar de filtros + grid de productos.
 * La lógica de fetching y filtrado vive en useCatalogo() —
 * este componente solo se ocupa de la presentación.
 *
 * Para rediseñar con v0: reemplazar el JSX manteniendo el hook intacto.
 */

import { useState } from 'react'
import { ShoppingCart, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, PawPrint } from 'lucide-react'
import { useCatalogo } from '../../hooks/useCatalogo'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import CartDrawer from '../../components/cart/CartDrawer'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

// ─── Sidebar de filtros ───────────────────────────────────────────────────────

function Sidebar({ categorias, filtros, actualizarFiltro, limpiarFiltros, mobileOpen, onClose }) {
  const hayFiltrosActivos = filtros.categoria_id || !filtros.solo_con_stock

  const content = (
    <aside className="w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-surface-200 p-5 sticky top-24">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-brand-500" />
            <h2 className="font-display text-base font-semibold text-gray-900">Filtros</h2>
          </div>
          <div className="flex items-center gap-2">
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-xs text-brand-500 hover:text-brand-700 font-body font-medium transition-colors"
              >
                Limpiar
              </button>
            )}
            {/* Botón cerrar solo en móvil */}
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filtro: stock */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => actualizarFiltro('solo_con_stock', !filtros.solo_con_stock)}
              className={`w-10 h-5 rounded-full transition-colors relative ${filtros.solo_con_stock ? 'bg-brand-500' : 'bg-surface-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filtros.solo_con_stock ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-body text-gray-700 group-hover:text-gray-900 transition-colors">
              Solo con stock
            </span>
          </label>
        </div>

        {/* Divider */}
        <div className="h-px bg-surface-200 mb-5" />

        {/* Filtro: categorías */}
        <div>
          <h3 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Categorías
          </h3>
          <ul className="space-y-1">
            {/* Opción "Todas" */}
            <li>
              <button
                onClick={() => actualizarFiltro('categoria_id', null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-body transition-colors ${
                  !filtros.categoria_id
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-surface-100'
                }`}
              >
                Todas las categorías
              </button>
            </li>

            {categorias.map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => actualizarFiltro('categoria_id', cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-body transition-colors ${
                    filtros.categoria_id === cat.id
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-gray-600 hover:bg-surface-100'
                  }`}
                >
                  {cat.nombre}
                </button>
              </li>
            ))}

            {categorias.length === 0 && (
              <li className="text-sm text-gray-400 px-3 py-2 font-body italic">
                Sin categorías
              </li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: siempre visible */}
      <div className="hidden md:block">{content}</div>

      {/* Mobile: drawer con overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface-50 overflow-y-auto p-4">
            {content}
          </div>
        </div>
      )}
    </>
  )
}

// ─── Barra de búsqueda ────────────────────────────────────────────────────────

function SearchBar({ value, onChange, onMobileFilterOpen }) {
  const [input, setInput] = useState(value || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onChange(input.trim() || null)
  }

  const handleClear = () => {
    setInput('')
    onChange(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Botón filtros en móvil */}
      <button
        type="button"
        onClick={onMobileFilterOpen}
        className="md:hidden flex items-center gap-2 bg-white border border-surface-200 text-gray-600 px-3 py-2.5 rounded-xl text-sm font-body hover:border-brand-300 transition-colors"
      >
        <SlidersHorizontal size={16} />
        Filtros
      </button>

      {/* Input de búsqueda */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Buscar productos para tu mascota..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
        />
        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-colors"
      >
        Buscar
      </button>
    </form>
  )
}

// ─── Card de producto ─────────────────────────────────────────────────────────

function ProductoCard({ producto, onAgregar }) {
  const [agregado, setAgregado] = useState(false)
  const sinStock = !producto.stock || producto.stock.cantidad === 0

  const handleAgregar = () => {
    if (sinStock) return
    onAgregar(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <article className="bg-white rounded-2xl border border-surface-200 overflow-hidden group hover:shadow-md hover:border-brand-200 transition-all duration-200 flex flex-col">
      {/* Imagen */}
      <Link to={`/producto/${producto.id}`} className="aspect-square bg-surface-100 relative overflow-hidden block">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PawPrint size={40} className="text-surface-300" />
          </div>
        )}

        {/* Badge sin stock */}
        {sinStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-body font-medium px-3 py-1 rounded-full">
              Sin stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Categoría */}
        {producto.category_id && (
          <span className="text-xs text-brand-500 font-body font-medium uppercase tracking-wide mb-1">
            {producto.category?.nombre ?? ''}
          </span>
        )}

        {/* Nombre */}
        <Link to={`/producto/${producto.id}`} className="block flex-1 mb-2">
          <h3 className="font-body font-medium text-gray-900 text-sm leading-snug line-clamp-2 hover:text-brand-500 transition-colors">
            {producto.nombre}
          </h3>
        </Link>

        {/* Precio y botón */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="font-display text-lg font-bold text-gray-900">
            ${producto.precio.toLocaleString('es-AR')}
          </span>

          <button
            onClick={handleAgregar}
            disabled={sinStock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body font-medium transition-all ${
              sinStock
                ? 'bg-surface-100 text-gray-400 cursor-not-allowed'
                : agregado
                  ? 'bg-green-500 text-white scale-95'
                  : 'bg-brand-500 hover:bg-brand-600 text-white active:scale-95'
            }`}
          >
            <ShoppingCart size={14} />
            {agregado ? '¡Listo!' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Grid de productos ────────────────────────────────────────────────────────

function ProductosGrid({ productos, loading, error, onAgregar }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-surface-200 overflow-hidden animate-pulse">
            <div className="aspect-square bg-surface-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-surface-200 rounded-full w-1/3" />
              <div className="h-4 bg-surface-200 rounded-full w-full" />
              <div className="h-4 bg-surface-200 rounded-full w-2/3" />
              <div className="h-8 bg-surface-200 rounded-xl mt-3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <X size={28} className="text-red-400" />
        </div>
        <p className="font-body text-gray-500 text-sm">{error}</p>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-surface-200 rounded-2xl flex items-center justify-center mb-4">
          <PawPrint size={28} className="text-surface-300" />
        </div>
        <p className="font-display text-gray-700 text-lg mb-1">Sin resultados</p>
        <p className="font-body text-gray-400 text-sm">
          Probá con otra búsqueda o categoría
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {productos.map(p => (
        <ProductoCard key={p.id} producto={p} onAgregar={onAgregar} />
      ))}
    </div>
  )
}

// ─── Paginación ───────────────────────────────────────────────────────────────

function Paginacion({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="p-2 rounded-xl border border-surface-200 text-gray-500 hover:border-brand-300 hover:text-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      <span className="font-body text-sm text-gray-500 px-3">
        Página <span className="font-semibold text-gray-900">{page}</span> de {totalPages}
      </span>

      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="p-2 rounded-xl border border-surface-200 text-gray-500 hover:border-brand-300 hover:text-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CatalogoPage() {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [authData, setAuthData] = useState({ 
    email: '', 
    password: '',
    nombre: '',
    apellido: ''
  })

  const {
    productos, categorias, loading, error,
    filtros, actualizarFiltro, limpiarFiltros,
    page, setPage, totalPages,
  } = useCatalogo()

  const { agregar, cantidadItems, vaciar: vaciarCarrito } = useCartStore()
  const { login, register, logout, loading: authLoading, error: authError } = useAuthStore()

  const handleAuth = async (e) => {
    e.preventDefault()
    let success = false
    
    if (isRegister) {
      success = await register(authData.nombre, authData.apellido, authData.email, authData.password)
    } else {
      success = await login(authData.email, authData.password)
    }
    
    if (success) {
      setLoginOpen(false)
      setIsRegister(false)
      setAuthData({ email: '', password: '', nombre: '', apellido: '' })
    }
  }

  const handleLogout = () => {
    logout()
    vaciarCarrito()
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar
        cantidadItems={cantidadItems()}
        onCartClick={() => setCartOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Auth Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLoginOpen(false)} />
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
              
              {authError && <p className="text-xs text-red-500 font-medium">{authError}</p>}
              
              <button 
                type="submit"
                disabled={authLoading}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-2xl font-body font-bold text-base transition-all disabled:opacity-50"
              >
                {authLoading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión')}
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
      )}

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <SearchBar
            value={filtros.busqueda}
            onChange={val => actualizarFiltro('busqueda', val)}
            onMobileFilterOpen={() => setSidebarMobileOpen(true)}
          />
        </div>

        {/* Layout: sidebar + contenido */}
        <div className="flex gap-6 items-start">
          <Sidebar
            categorias={categorias}
            filtros={filtros}
            actualizarFiltro={actualizarFiltro}
            limpiarFiltros={limpiarFiltros}
            mobileOpen={sidebarMobileOpen}
            onClose={() => setSidebarMobileOpen(false)}
          />

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Contador de resultados */}
            {!loading && !error && (
              <p className="text-sm font-body text-gray-400 mb-4">
                {productos.length > 0
                  ? `Mostrando ${productos.length} productos`
                  : null}
              </p>
            )}

            <ProductosGrid
              productos={productos}
              loading={loading}
              error={error}
              onAgregar={agregar}
            />

            <Paginacion page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </main>
    </div>
  )
}
