import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'
import { useState } from 'react'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, quitar, setCantidad, total, vaciar } = useCartStore()
  const { user, isLoggedIn } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [direccion, setDireccion] = useState('')

  const handleCheckout = async () => {
    if (!isLoggedIn()) {
      setError('Debes iniciar sesión para finalizar la compra.')
      return
    }

    if (direccion.length < 10) {
      setError('Por favor, ingresá una dirección de entrega válida (mín. 10 caracteres).')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const checkoutData = {
        items: items.map(item => ({
          product_id: item.product_id,
          cantidad: item.cantidad
        })),
        direccion_entrega: direccion
      }
      
      await api.post('/cart/checkout', checkoutData)
      setSuccess(true)
      vaciar()
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al procesar la compra. Verifica el stock.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-surface-200 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-brand-500" />
              <h2 className="text-lg font-display font-bold text-gray-900">Tu Carrito</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-surface-100 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight size={32} />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2">¡Pedido realizado!</h3>
                <p className="text-gray-500 text-sm">Tu pedido ha sido procesado exitosamente.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-surface-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-500 text-sm mb-6">¡Agregá algunos productos para tu mascota!</p>
                <button 
                  onClick={onClose}
                  className="text-brand-500 font-body font-medium hover:text-brand-600 underline"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-4">
                    <div className="w-20 h-20 bg-surface-100 rounded-xl overflow-hidden shrink-0">
                      {item.imagen_url ? (
                        <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-300">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between gap-2">
                          <h4 className="text-sm font-body font-medium text-gray-900 line-clamp-2">{item.nombre}</h4>
                          <button 
                            onClick={() => quitar(item.product_id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-brand-600 font-display font-bold mt-1">${item.precio.toLocaleString('es-AR')}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => setCantidad(item.product_id, item.cantidad - 1)}
                            className="p-1 px-2 hover:bg-surface-100 text-gray-500 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-gray-700">{item.cantidad}</span>
                          <button 
                            onClick={() => setCantidad(item.product_id, item.cantidad + 1)}
                            className="p-1 px-2 hover:bg-surface-100 text-gray-500 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!success && items.length > 0 && (
            <div className="px-6 py-6 border-t border-surface-200 bg-surface-50">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-body">
                  {error}
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-body">Subtotal</span>
                <span className="text-xl font-display font-bold text-gray-900">${total().toLocaleString('es-AR')}</span>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-body font-semibold text-gray-400 uppercase mb-1.5 ml-1">Dirección de Entrega</label>
                <input 
                  type="text" 
                  placeholder="Calle Falsa 123, Mar del Plata"
                  className="w-full px-4 py-2 bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm font-body"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-surface-300 text-white py-3.5 rounded-2xl font-body font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-brand-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Finalizar Compra
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <p className="text-center text-[10px] text-gray-400 mt-4 font-body">
                Al finalizar la compra, se generará una orden que podrás ver en tu historial de pedidos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
