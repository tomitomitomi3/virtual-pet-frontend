/**
 * InicioPage — Landing page de Virtual Pet.
 *
 * Estructura inspirada en emunartte.com.ar:
 * - Banner superior animado con promoción
 * - Hero con slogan e imagen
 * - Sección de categorías destacadas
 * - Sección "quiénes somos"
 * - Productos destacados (hardcoded hasta integrar la API)
 * - Footer
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, PawPrint, Truck, Shield, Heart, Phone, Mail, Instagram, MapPin, ArrowRight, Star } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import Navbar from '../components/Navbar'
import AuthModal from '../components/auth/AuthModal'
import CartDrawer from '../components/cart/CartDrawer'

// ─── Banner superior animado ──────────────────────────────────────────────────

function TopBanner() {
  const mensaje = "🐾 Envío a domicilio en Mar del Plata • Virtual Pet nunca defraudará a su mascota 🐾"
  return (
    <div className="bg-gray-900 text-white overflow-hidden py-2">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-xs font-body tracking-wide mx-8 shrink-0">
            {mensaje}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

// Cargamos dinámicamente todas las imágenes de la carpeta assets/hero
const localImages = import.meta.glob('../assets/hero/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' })
const localImageUrls = Object.values(localImages)

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop", // Perro feliz
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop", // Gato
  "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop", // Perro Golden
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1000&auto=format&fit=crop"  // Perro y gato
]

// Usamos las imágenes locales si existen, si no, usamos las de respaldo
const HERO_IMAGES = localImageUrls.length > 0 ? localImageUrls : FALLBACK_IMAGES

function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative bg-surface-50 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50 rounded-bl-[80px]" />
        <div className="absolute bottom-12 left-12 w-32 h-32 rounded-full bg-brand-100 opacity-40" />
        <div className="absolute top-20 right-1/3 w-16 h-16 rounded-full bg-brand-200 opacity-30" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
        {/* Texto */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-body font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Tienda para mascotas · Mar del Plata
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Todo para tu<br />
            <span className="text-brand-500">mascota</span>,<br />
            en un click.
          </h1>
          <p className="font-body text-gray-500 text-lg mb-8 max-w-md">
            Virtual Pet nunca defraudará a su mascota. Alimentos, juguetes, accesorios y más — con entrega a domicilio en Mar del Plata.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-body font-medium transition-colors"
            >
              Ver productos <ArrowRight size={16} />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 bg-white border border-surface-200 hover:border-brand-300 text-gray-700 px-6 py-3 rounded-xl font-body font-medium transition-colors"
            >
              Contactarnos
            </Link>
          </div>
        </div>

        {/* Slider de imágenes */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="w-full h-full bg-brand-100 rounded-[40px] overflow-hidden shadow-2xl relative">
              {HERO_IMAGES.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`Mascota ${idx + 1}`} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    idx === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* Controles del Slider */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentImage ? 'bg-brand-500 w-6' : 'bg-brand-200 hover:bg-brand-300'
                  }`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>

            {/* Badges flotantes */}
            <div className="absolute -top-4 -right-4 bg-white shadow-lg rounded-2xl px-4 py-2 flex items-center gap-2 z-10">
              <Truck size={16} className="text-brand-500" />
              <span className="text-xs font-body font-semibold text-gray-700">Envío a domicilio</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-2xl px-4 py-2 flex items-center gap-2 z-10">
              <Shield size={16} className="text-brand-500" />
              <span className="text-xs font-body font-semibold text-gray-700">Compra segura</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Categorías destacadas ────────────────────────────────────────────────────

const CATEGORIAS = [
  { nombre: 'Alimentos',   emoji: '🍖', descripcion: 'Para perros, gatos, peces y aves',  color: 'bg-orange-50 border-orange-100' },
  { nombre: 'Juguetes',    emoji: '🎾', descripcion: 'Entretenimiento para toda mascota',  color: 'bg-blue-50 border-blue-100' },
  { nombre: 'Accesorios',  emoji: '🦮', descripcion: 'Collares, correas y complementos',   color: 'bg-green-50 border-green-100' },
  { nombre: 'Higiene',     emoji: '🛁', descripcion: 'Shampoos y productos de cuidado',    color: 'bg-purple-50 border-purple-100' },
  { nombre: 'Vivienda',    emoji: '🏠', descripcion: 'Cuchas, camas y acuarios',           color: 'bg-yellow-50 border-yellow-100' },
  { nombre: 'Salud',       emoji: '💊', descripcion: 'Vitaminas y antiparasitarios',       color: 'bg-red-50 border-red-100' },
]

function Categorias() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Explorá por categoría</h2>
        <p className="font-body text-gray-400">Todo lo que tu mascota necesita en un solo lugar</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIAS.map(cat => (
          <Link
            key={cat.nombre}
            to="/catalogo"
            className={`${cat.color} border rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-200 group`}
          >
            <div className="text-4xl mb-2">{cat.emoji}</div>
            <h3 className="font-body font-semibold text-gray-800 text-sm mb-1">{cat.nombre}</h3>
            <p className="font-body text-gray-500 text-xs leading-tight hidden md:block">{cat.descripcion}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Beneficios ───────────────────────────────────────────────────────────────

function Beneficios() {
  const items = [
    { icon: Truck,  titulo: 'Envío a domicilio',   texto: 'Entregamos en Mar del Plata con equipo propio o courier.' },
    { icon: Shield, titulo: 'Compra segura',        texto: 'Tu información está protegida en todo momento.' },
    { icon: Heart,  titulo: 'Para tu mascota',      texto: 'Productos seleccionados para el bienestar animal.' },
    { icon: Star,   titulo: 'Calidad garantizada',  texto: 'Solo trabajamos con marcas de confianza.' },
  ]

  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(item => (
            <div key={item.titulo} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-500/20 rounded-2xl flex items-center justify-center">
                <item.icon size={22} className="text-brand-400" />
              </div>
              <h3 className="font-display text-white font-semibold">{item.titulo}</h3>
              <p className="font-body text-gray-400 text-sm">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Quiénes somos ────────────────────────────────────────────────────────────

function QuienesSomos() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-20">
      <div className="bg-brand-50 rounded-4xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
        <div className="w-48 h-48 md:w-64 md:h-64 bg-brand-100 rounded-[40px] overflow-hidden shadow-xl shrink-0 -rotate-2 hover:rotate-0 transition-transform duration-500">
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop" 
            alt="Gato curioso" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <span className="inline-block bg-brand-200 text-brand-800 text-xs font-body font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Nuestra historia
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Nacimos para cuidar a tu mascota
          </h2>
          <p className="font-body text-gray-600 leading-relaxed mb-4">
            Virtual Pet es una tienda 100% digital con alcance en Mar del Plata. Creemos que cada mascota merece lo mejor, por eso seleccionamos cuidadosamente cada producto que ofrecemos.
          </p>
          <p className="font-body text-gray-600 leading-relaxed mb-6">
            Sin locales físicos, operamos de forma eficiente para ofrecerte los mejores precios con entrega directa en tu domicilio. Porque la comodidad también es parte del cuidado.
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 text-brand-600 font-body font-semibold hover:text-brand-700 transition-colors"
          >
            Conocé más sobre nosotros <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── CTA final ────────────────────────────────────────────────────────────────

function CTAFinal() {
  return (
    <section className="bg-brand-500 py-16">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para mimarte con tu mascota?
        </h2>
        <p className="font-body text-brand-100 mb-8 text-lg">
          Explorá todo nuestro catálogo y hacé tu pedido hoy.
        </p>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 bg-white hover:bg-surface-100 text-brand-600 font-body font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Ver tienda <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-6">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                <PawPrint size={16} className="text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Virtual<span className="text-brand-400">Pet</span>
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed">
              Tienda 100% digital para mascotas.<br />
              Mar del Plata, Buenos Aires.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2 font-body text-sm">
              {[
                { label: 'Inicio',       to: '/' },
                { label: 'Tienda',       to: '/catalogo' },
                { label: 'Contacto',     to: '/contacto' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-brand-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-400 shrink-0" />
                Mar del Plata, Buenos Aires
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-400 shrink-0" />
                contacto@virtualpet.com.ar
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-400 shrink-0" />
                +54 9 223 000-0000
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={14} className="text-brand-400 shrink-0" />
                @virtualpet.mdq
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center font-body text-xs">
          © {new Date().getFullYear()} Virtual Pet. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

// ─── Página completa ──────────────────────────────────────────────────────────

export default function InicioPage() {
  const { cantidadItems, vaciar: vaciarCarrito } = useCartStore()
  const { logout } = useAuthStore()

  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const handleLogout = () => {
    logout()
    vaciarCarrito()
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <TopBanner />
      <Navbar 
        cantidadItems={cantidadItems()} 
        onCartClick={() => setCartOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <Hero />
      <Categorias />
      <Beneficios />
      <QuienesSomos />
      <CTAFinal />
      <Footer />
    </div>
  )
}