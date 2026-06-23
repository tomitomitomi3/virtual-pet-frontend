import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User as UserIcon, 
  Package, 
  Lock, 
  LogOut, 
  ChevronRight, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Eye,
  Users
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import Navbar from '../components/Navbar'
import CartDrawer from '../components/cart/CartDrawer'
import AuthModal from '../components/auth/AuthModal'
import api from '../services/api'
import UserManagement from './UserManagement'

const ESTADOS_ORDEN = {
  pendiente: { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  en_preparacion: { label: 'En preparación', color: 'text-blue-600 bg-blue-50', icon: Package },
  despachado: { label: 'Despachado', color: 'text-purple-600 bg-purple-50', icon: Truck },
  en_camino: { label: 'En camino', color: 'text-indigo-600 bg-indigo-50', icon: Truck },
  entregado: { label: 'Entregado', color: 'text-green-600 bg-green-50', icon: CheckCircle2 },
  cancelado: { label: 'Cancelado', color: 'text-red-600 bg-red-50', icon: AlertCircle }
}

export default function MyAccount() {
  const { user, logout, updateProfile, changePassword, loading: authLoading, error: authError } = useAuthStore()
  const { cantidadItems, vaciar: vaciarCarrito } = useCartStore()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'orders', 'security'
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Forms state
  const [profileData, setProfileData] = useState({ 
    nombre: user?.nombre || '', 
    apellido: user?.apellido || '' 
  })
  const [passwordData, setPasswordData] = useState({ 
    current: '', 
    new: '', 
    confirm: '' 
  })
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  // Polling para actualización en tiempo real de pedidos
  useEffect(() => {
    let intervalId;

    if (activeTab === 'orders') {
      const poll = () => {
        fetchOrders(true);
        if (selectedOrder) {
          fetchOrderDetails(selectedOrder.id, true);
        }
      };
      
      intervalId = setInterval(poll, 10000); // Actualizar cada 10 segundos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab, selectedOrder?.id]);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoadingOrders(true)
    try {
      const response = await api.get('/orders')
      setOrders(response.data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      if (!silent) setLoadingOrders(false)
    }
  }

  const fetchOrderDetails = async (orderId, silent = false) => {
    // No usamos un loading state global para el detalle para evitar saltos en la UI durante el polling
    try {
      const response = await api.get(`/orders/${orderId}`)
      setSelectedOrder(response.data)
    } catch (err) {
      console.error('Error fetching order details:', err)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    const success = await updateProfile(profileData.nombre, profileData.apellido)
    if (success) setSuccessMsg('Perfil actualizado correctamente')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    if (passwordData.new !== passwordData.confirm) {
      alert('Las contraseñas no coinciden')
      return
    }
    const success = await changePassword(passwordData.current, passwordData.new)
    if (success) {
      setSuccessMsg('Contraseña cambiada correctamente')
      setPasswordData({ current: '', new: '', confirm: '' })
    }
  }

  const handleLogout = () => {
    logout()
    vaciarCarrito()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-surface-50 font-body">
      <Navbar 
        cantidadItems={cantidadItems()} 
        onCartClick={() => setCartOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />
      
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-surface-100 bg-surface-50/50">
                <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-white mb-3">
                  <UserIcon size={24} />
                </div>
                <h2 className="font-display font-bold text-gray-900 leading-tight">
                  {user.nombre} {user.apellido}
                </h2>
                <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
              </div>
              
              <nav className="p-2">
                {[
                  { id: 'profile', label: 'Mi Perfil', icon: UserIcon },
                  { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBag },
                  ...(user.role === 'admin' ? [{ id: 'users', label: 'Gestión de Usuarios', icon: Users }] : []),
                  { id: 'security', label: 'Seguridad', icon: Lock },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSelectedOrder(null); setSuccessMsg(''); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id 
                        ? 'bg-brand-50 text-brand-600' 
                        : 'text-gray-500 hover:bg-surface-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                    {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                ))}
                
                <div className="h-px bg-surface-100 my-2" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl border border-surface-200 shadow-sm p-6 md:p-8 min-h-[500px]">
              
              {/* Tab: Profile */}
              {activeTab === 'profile' && (
                <div className="max-w-md">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Información Personal</h3>
                  <p className="text-sm text-gray-500 mb-8">Actualizá tus datos para que podamos contactarte mejor.</p>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nombre</label>
                        <input 
                          type="text" 
                          value={profileData.nombre}
                          onChange={e => setProfileData({...profileData, nombre: e.target.value})}
                          className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Apellido</label>
                        <input 
                          type="text" 
                          value={profileData.apellido}
                          onChange={e => setProfileData({...profileData, apellido: e.target.value})}
                          className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email (No editable)</label>
                      <input 
                        type="email" 
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-surface-100 border border-surface-200 rounded-xl text-gray-400 text-sm cursor-not-allowed"
                      />
                    </div>

                    {authError && <p className="text-sm text-red-500 font-medium">{authError}</p>}
                    {successMsg && <p className="text-sm text-green-600 font-medium">{successMsg}</p>}

                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      {authLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Security */}
              {activeTab === 'security' && (
                <div className="max-w-md">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Seguridad</h3>
                  <p className="text-sm text-gray-500 mb-8">Cambiá tu contraseña periódicamente para mantener tu cuenta segura.</p>
                  
                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Contraseña Actual</label>
                      <input 
                        type="password" 
                        value={passwordData.current}
                        onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                        required
                      />
                    </div>
                    
                    <div className="h-px bg-surface-100 my-4" />
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        value={passwordData.new}
                        onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                        placeholder="Mínimo 8 caracteres con un número"
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Confirmar Nueva Contraseña</label>
                      <input 
                        type="password" 
                        value={passwordData.confirm}
                        onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                        placeholder="Repetí la nueva contraseña"
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                        required
                      />
                    </div>

                    {authError && <p className="text-sm text-red-500 font-medium">{authError}</p>}
                    {successMsg && <p className="text-sm text-green-600 font-medium">{successMsg}</p>}

                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      {authLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Users (Admin Only) */}
              {activeTab === 'users' && user.role === 'admin' && (
                <UserManagement />
              )}

              {/* Tab: Orders */}
              {activeTab === 'orders' && (
                <div className="h-full">
                  {!selectedOrder ? (
                    <>
                      <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Mis Pedidos</h3>
                      <p className="text-sm text-gray-500 mb-8">Seguí el estado de tus compras en tiempo real.</p>
                      
                      {loadingOrders ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                          <ShoppingBag size={48} className="text-surface-200 mb-4" />
                          <div className="h-4 bg-surface-100 w-32 rounded-full mb-2" />
                          <div className="h-3 bg-surface-100 w-24 rounded-full" />
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map(order => {
                            const config = ESTADOS_ORDEN[order.estado] || { label: order.estado, color: 'bg-gray-100 text-gray-600', icon: AlertCircle };
                            const StatusIcon = config.icon;
                            
                            return (
                              <div 
                                key={order.id}
                                className="group flex items-center gap-4 p-4 bg-white border border-surface-200 rounded-2xl hover:border-brand-200 hover:shadow-sm transition-all"
                              >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color} shrink-0`}>
                                  <StatusIcon size={24} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-bold text-gray-900">Pedido #{order.id}</span>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${config.color}`}>
                                      {config.label}
                                    </span>
                                    {order.billing_cuit && (
                                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-body">
                                        Factura Solicitada
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400 font-medium">
                                    {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                  </p>
                                </div>
                                
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-bold text-gray-900 mb-1">${order.total.toLocaleString('es-AR')}</p>
                                  <button 
                                    onClick={() => fetchOrderDetails(order.id)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                                  >
                                    <Eye size={14} />
                                    Ver detalle
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-20 h-20 bg-surface-50 rounded-3xl flex items-center justify-center mb-6">
                            <ShoppingBag size={40} className="text-surface-200" />
                          </div>
                          <h4 className="text-lg font-display font-bold text-gray-900 mb-2">Aún no tenés pedidos</h4>
                          <p className="text-sm text-gray-500 max-w-xs mb-8">
                            Cuando realices tu primera compra, vas a poder ver todo el historial y seguir el envío acá.
                          </p>
                          <Link 
                            to="/catalogo"
                            className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95"
                          >
                            Ir a la Tienda
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-600 mb-6 transition-colors"
                      >
                        <ChevronRight size={18} className="rotate-180" />
                        Volver al listado
                      </button>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                          <h3 className="text-2xl font-display font-bold text-gray-900">Detalle del Pedido #{selectedOrder.id}</h3>
                          <p className="text-sm text-gray-500">
                            Realizado el {new Date(selectedOrder.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className={`self-start sm:self-center px-4 py-2 rounded-2xl flex items-center gap-2 ${(ESTADOS_ORDEN[selectedOrder.estado] || {}).color}`}>
                          {(() => {
                            const config = ESTADOS_ORDEN[selectedOrder.estado] || { label: selectedOrder.estado, icon: AlertCircle };
                            const Icon = config.icon;
                            return (
                              <>
                                <Icon size={18} />
                                <span className="text-sm font-bold uppercase tracking-wide">{config.label}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Productos</h4>
                          <div className="bg-surface-50 rounded-2xl border border-surface-100 divide-y divide-surface-100 overflow-hidden">
                            {selectedOrder.items.map(item => (
                              <div key={item.product_id} className="flex items-center gap-4 p-4">
                                <div className="w-12 h-12 bg-white rounded-xl border border-surface-200 flex items-center justify-center shrink-0 overflow-hidden">
                                  {item.producto_imagen_url ? (
                                    <img src={item.producto_imagen_url} alt={item.producto_nombre} className="w-full h-full object-cover" />
                                  ) : (
                                    <ShoppingBag size={20} className="text-surface-300" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">{item.producto_nombre || `Producto #${item.product_id}`}</p>
                                  <p className="text-xs text-gray-500">{item.cantidad} unidad(es) x ${item.precio_unitario.toLocaleString('es-AR')}</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900">${item.subtotal.toLocaleString('es-AR')}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resumen */}
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Resumen de Pago</h4>
                            <div className="bg-white rounded-2xl border border-surface-200 p-5 space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900 font-medium">${selectedOrder.total.toLocaleString('es-AR')}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Envío</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                              </div>
                              <div className="h-px bg-surface-100 my-2" />
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-xl font-display font-bold text-brand-600">${selectedOrder.total.toLocaleString('es-AR')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Dirección de Entrega</h4>
                            <div className="bg-white rounded-2xl border border-surface-200 p-5 flex gap-3">
                              <Truck size={18} className="text-gray-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {selectedOrder.direccion_entrega}
                              </p>
                            </div>
                          </div>

                          {selectedOrder.billing_cuit && (
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Datos de Facturación</h4>
                              <div className="bg-white rounded-2xl border border-surface-200 p-5 flex flex-col gap-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold text-gray-700">Tipo:</span> Factura A
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold text-gray-700">CUIT:</span> {selectedOrder.billing_cuit}
                                </p>
                                {selectedOrder.billing_requested_at && (
                                  <p className="text-xs text-gray-400">
                                    Solicitada el {new Date(selectedOrder.billing_requested_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
