import { Routes, Route } from 'react-router-dom'
import CatalogoPage from './pages/catalogo/CatalogoPage'
import ProductDetailPage from './pages/catalogo/ProductDetailPage'
import HomePage from './pages/HomePage'
import MyAccount from './pages/MyAccount'
import ContactoPage from './pages/ContactoPage'
import NotFoundPage from './pages/NotFoundPage'
import ScrollToTop from './components/ScrollToTop'
import ChatBot from './components/chatbot/ChatBot'

export default function App() {
  return (
    <>
      <ScrollToTop/>
      <Routes>
        {/* Ruta de inicio */}
        <Route path="/" element={<HomePage />} />
      
        {/* Catálogo */}
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/mi-cuenta" element={<MyAccount />} />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <ChatBot />
    </>
  )
}