import { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Search, 
  X, 
  AlertCircle, 
  Loader2,
  ChevronLeft
} from 'lucide-react'
import api from '../services/api'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function UserManagement() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal state for adding user
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/mi-cuenta')
      return
    }
    fetchUsers()
  }, [user, navigate])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    console.log('Fetching users from: /auth/users')
    try {
      // Intentamos con /auth/users basándonos en la estructura común de la API
      const response = await api.get('/auth/users')
      setUsers(response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('No tenés permisos para ver esta sección o hubo un error al cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar a este usuario?')) return
    
    try {
      await api.delete(`/auth/users/${userId}`)
      setUsers(users.filter(u => u.id !== userId))
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Error al eliminar el usuario.')
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setAddLoading(true)
    setAddError(null)
    try {
      // El registro de nuevos usuarios suele estar en /auth/register
      const response = await api.post('/auth/register', newUserData)
      // Si el backend devuelve el usuario creado, lo agregamos a la lista
      // Si no, recargamos la lista
      if (response.data && (response.data.user || response.data.id)) {
        setUsers([...users, response.data.user || response.data])
      } else {
        await fetchUsers()
      }
      setIsAddModalOpen(false)
      setNewUserData({ nombre: '', apellido: '', email: '', password: '' })
    } catch (err) {
      setAddError(err.response?.data?.detail || 'Error al agregar el usuario.')
    } finally {
      setAddLoading(false)
    }
  }

  const filteredUsers = users.filter(u => 
    (u.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.apellido || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={48} className="text-brand-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Acceso Denegado</h3>
        <p className="text-gray-500 max-w-xs mb-8">{error}</p>
        <button 
          onClick={() => fetchUsers()}
          className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-display font-bold text-gray-900">Gestión de Usuarios</h3>
          <p className="text-sm text-gray-500">Administrá los clientes registrados en el sistema.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:border-brand-500 transition-all text-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                          {(u.nombre || '?')[0]}{(u.apellido || '')[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{u.nombre} {u.apellido}</p>
                          <div className="flex gap-1 mt-1">
                            {u.role === 'admin' && (
                              <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>
                            )}
                            {u.role === 'cliente' && (
                              <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Cliente</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.id !== u.id && (
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-20 text-center">
                    <Users size={48} className="text-surface-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No se encontraron usuarios.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-display font-bold text-gray-900">Agregar Usuario</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Nombre</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                    value={newUserData.nombre}
                    onChange={e => setNewUserData({...newUserData, nombre: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Apellido</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                    value={newUserData.apellido}
                    onChange={e => setNewUserData({...newUserData, apellido: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                  value={newUserData.email}
                  onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Contraseña</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all text-sm"
                  value={newUserData.password}
                  onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                />
              </div>
              
              {addError && <p className="text-xs text-red-500 font-medium">{addError}</p>}
              
              <button 
                type="submit"
                disabled={addLoading}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50"
              >
                {addLoading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
