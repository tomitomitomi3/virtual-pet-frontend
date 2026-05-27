import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, PawPrint, Shield, Truck, Info, Check } from 'lucide-react'
import { useProduct } from '../../hooks/useProduct'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import Navbar from '../../components/Navbar'
import AuthModal from '../../components/auth/AuthModal'
import CartDrawer from '../../components/cart/CartDrawer'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { agregar } = useCartStore()
  const { logout } = useAuthStore()

  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [agregado, setAgregado] = useState(false)

  const handleAgregar = () => {
    if (!product || !product.stock || product.stock.cantidad === 0) return
    agregar(product)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Navbar onCartClick={() => setCartOpen(true)} onLoginClick={() => setLoginOpen(true)} onLogout={logout} />
        <div className="max-w-screen-xl mx-auto px-6 py-12 animate-pulse">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 aspect-square bg-surface-200 rounded-3xl" />
            <div className="flex-1 space-y-6">
              <div className="h-4 bg-surface-200 rounded w-1/4" />
              <div className="h-10 bg-surface-200 rounded w-3/4" />
              <div className="h-6 bg-surface-200 rounded w-1/2" />
              <div className="h-32 bg-surface-200 rounded w-full" />
              <div className="h-12 bg-surface-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col">
        <Navbar onCartClick={() => setCartOpen(true)} onLoginClick={() => setLoginOpen(true)} onLogout={logout} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
            <Info size={40} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Producto no encontrado</h1>
          <p className="text-gray-500 mb-8 max-w-sm">Lo sentimos, no pudimos encontrar el producto que buscás o hubo un error al cargar la información.</p>
          <Link to="/catalogo" className="bg-brand-500 text-white px-8 py-3 rounded-2xl font-body font-bold hover:bg-brand-600 transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  const sinStock = !product.stock || product.stock.cantidad === 0

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar onCartClick={() => setCartOpen(true)} onLoginClick={() => setLoginOpen(true)} onLogout={logout} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumbs / Volver */}
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-500 transition-colors mb-8 font-body text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </Link>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Columna Imagen */}
          <div className="flex-1 w-full max-w-2xl mx-auto">
            <div className="aspect-square bg-white rounded-3xl border border-surface-200 overflow-hidden relative shadow-sm">
              {product.imagen_url ? (
                <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-contain p-4" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-50">
                  <PawPrint size={120} className="text-surface-200" />
                </div>
              )}
              {sinStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-gray-900 text-white px-6 py-2 rounded-full font-display font-bold text-sm tracking-wide">SIN STOCK</span>
                </div>
              )}
            </div>
          </div>

          {/* Columna Info */}
          <div className="flex-1 w-full">
            <div className="sticky top-24">
              {/* Categoría */}
              {product.category && (
                <span className="inline-block bg-brand-50 text-brand-600 text-xs font-body font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  {product.category.nombre}
                </span>
              )}

              {/* Título y Precio */}
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 leading-tight mb-4">
                {product.nombre}
              </h1>
              
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-display font-bold text-gray-900">
                  ${product.precio.toLocaleString('es-AR')}
                </span>
                {product.precio_oferta && (
                  <span className="text-xl text-gray-400 line-through font-body">
                    ${product.precio_oferta.toLocaleString('es-AR')}
                  </span>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-8 border-t border-surface-200 pt-8">
                <h3 className="text-sm font-display font-bold text-gray-900 uppercase tracking-wider mb-3">Descripción</h3>
                <p className="text-gray-600 font-body leading-relaxed whitespace-pre-line">
                  {product.descripcion || 'Sin descripción disponible para este producto.'}
                </p>
              </div>

              {/* Stock Info */}
              <div className="mb-8 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${sinStock ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className={`text-sm font-body font-medium ${sinStock ? 'text-red-500' : 'text-green-600'}`}>
                  {sinStock ? 'Sin stock disponible' : `¡En stock! (${product.stock?.cantidad} unidades disponibles)`}
                </span>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={handleAgregar}
                  disabled={sinStock}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-body font-bold text-lg transition-all ${
                    sinStock
                      ? 'bg-surface-200 text-gray-400 cursor-not-allowed'
                      : agregado
                        ? 'bg-green-500 text-white'
                        : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-200 active:scale-95'
                  }`}
                >
                  {agregado ? (
                    <>
                      <Check size={24} />
                      ¡Agregado!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      Agregar al carrito
                    </>
                  )}
                </button>
              </div>

              {/* Beneficios / Info adicional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-surface-200 pt-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                    <Truck size={20} className="text-brand-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-gray-900">Envío Gratis</h4>
                    <p className="text-xs text-gray-500 font-body mt-1">En compras superiores a $30.000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                    <Shield size={20} className="text-brand-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-gray-900">Compra Segura</h4>
                    <p className="text-xs text-gray-500 font-body mt-1">Garantía de calidad Virtual Pet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
