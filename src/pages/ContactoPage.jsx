/**
 * ContactoPage — Página de contacto de Virtual Pet.
 *
 * Incluye formulario de contacto (sin backend por ahora),
 * datos de contacto y mapa/dirección.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PawPrint, Mail, Phone, Instagram, MapPin, Clock, Send, CheckCircle, ShoppingCart } from 'lucide-react'
import useCartStore from '../store/cartStore'

function Navbar({ cantidadItems }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <PawPrint size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-gray-900">
            Virtual<span className="text-brand-500">Pet</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Inicio',       to: '/' },
            { label: 'Tienda',       to: '/catalogo' },
            { label: 'Contacto',     to: '/contacto' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="text-sm font-body text-gray-600 hover:text-brand-500 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link to="/catalogo" className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl transition-colors font-body font-medium text-sm">
          <ShoppingCart size={16} />
          <span className="hidden sm:inline">Tienda</span>
          {cantidadItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-mono">
              {cantidadItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
      <div className="max-w-screen-xl mx-auto px-6 text-center font-body text-sm">
        <p className="mb-2">
          <Link to="/" className="hover:text-brand-400 transition-colors">Inicio</Link>
          {' · '}
          <Link to="/catalogo" className="hover:text-brand-400 transition-colors">Tienda</Link>
          {' · '}
        </p>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} Virtual Pet. Mar del Plata.</p>
      </div>
    </footer>
  )
}

export default function ContactoPage() {
  const { cantidadItems } = useCartStore()
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    // Simulación de envío — conectar con backend cuando esté disponible
    setTimeout(() => {
      setLoading(false)
      setEnviado(true)
    }, 1200)
  }

  const infoItems = [
    {
      icon: Mail,
      titulo: 'Email',
      valor: 'contacto@virtualpet.com.ar',
      sub: 'Respondemos en menos de 24hs',
    },
    {
      icon: Phone,
      titulo: 'Teléfono / WhatsApp',
      valor: '+54 9 223 000-0000',
      sub: 'Lunes a viernes de 9 a 18hs',
    },
    {
      icon: Instagram,
      titulo: 'Instagram',
      valor: '@virtualpet.mdq',
      sub: 'Seguinos para novedades',
    },
    {
      icon: MapPin,
      titulo: 'Zona de cobertura',
      valor: 'Mar del Plata, Buenos Aires',
      sub: 'Entrega a domicilio',
    },
    {
      icon: Clock,
      titulo: 'Horario de atención',
      valor: 'Lun–Vie: 9 a 18hs',
      sub: 'Sáb: 9 a 13hs',
    },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar cantidadItems={cantidadItems()} />

      {/* Header de página */}
      <div className="bg-white border-b border-surface-200 py-10">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-body font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
            Estamos acá para vos
          </span>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Contacto</h1>
          <p className="font-body text-gray-400">¿Tenés alguna consulta? Escribinos y te respondemos a la brevedad.</p>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Formulario */}
          <div className="bg-white rounded-2xl border border-surface-200 p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Envianos un mensaje</h2>

            {enviado ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900">¡Mensaje enviado!</h3>
                <p className="font-body text-gray-500 text-sm">
                  Te vamos a responder en menos de 24 horas hábiles.
                </p>
                <button
                  onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }) }}
                  className="mt-2 text-sm text-brand-500 hover:text-brand-700 font-body font-medium transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Juan García"
                      className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="juan@mail.com"
                      className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Asunto *
                  </label>
                  <select
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-body text-gray-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                  >
                    <option value="">Seleccioná un asunto</option>
                    <option value="pedido">Consulta sobre un pedido</option>
                    <option value="producto">Consulta sobre un producto</option>
                    <option value="envio">Información de envío</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Mensaje *
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Escribí tu consulta acá..."
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-3 rounded-xl font-body font-medium transition-colors"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>

          {/* Info de contacto */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Información de contacto</h2>
            {infoItems.map(item => (
              <div key={item.titulo} className="bg-white rounded-2xl border border-surface-200 p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-brand-500" />
                </div>
                <div>
                  <p className="text-xs font-body font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    {item.titulo}
                  </p>
                  <p className="font-body font-semibold text-gray-900 text-sm">{item.valor}</p>
                  <p className="font-body text-gray-400 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}