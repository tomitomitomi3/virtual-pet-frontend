/**
 * Hook custom para el catálogo de productos.
 *
 * Encapsula toda la lógica de fetching, filtrado y paginación.
 * El componente que lo use solo se ocupa de la presentación.
 * Si se rediseña la UI con v0 u otra herramienta, este hook no se toca.
 */
import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

/**
 * @param {Object} filtrosIniciales
 * @param {string|null} filtrosIniciales.busqueda
 * @param {number|null} filtrosIniciales.categoria_id
 * @param {boolean} filtrosIniciales.solo_con_stock
 */
export function useCatalogo(filtrosIniciales = {}) {
  const [productos, setProductos]       = useState([])
  const [categorias, setCategorias]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [totalPages, setTotalPages]     = useState(1)
  const [page, setPage]                 = useState(1)

  const [filtros, setFiltros] = useState({
    busqueda:      filtrosIniciales.busqueda      ?? null,
    categoria_id:  filtrosIniciales.categoria_id  ?? null,
    solo_con_stock: filtrosIniciales.solo_con_stock ?? true,
  })

  // Carga categorías una sola vez al montar
  useEffect(() => {
    api.get('/catalog/categories')
      .then(r => setCategorias(r.data))
      .catch(() => setCategorias([]))
  }, [])

  // Recarga productos cuando cambian filtros o página
  useEffect(() => {
    setLoading(true)
    setError(null)

    const params = { page, page_size: 12, solo_con_stock: filtros.solo_con_stock }
    if (filtros.busqueda)     params.busqueda     = filtros.busqueda
    if (filtros.categoria_id) params.categoria_id = filtros.categoria_id

    api.get('/catalog/products', { params })
      .then(r => {
        setProductos(r.data.items)
        setTotalPages(r.data.total_pages)
      })
      .catch(() => setError('No se pudo cargar el catálogo. Intentá de nuevo.'))
      .finally(() => setLoading(false))
  }, [filtros, page])

  /** Actualiza un filtro y vuelve a la página 1 */
  const actualizarFiltro = useCallback((clave, valor) => {
    setFiltros(prev => ({ ...prev, [clave]: valor }))
    setPage(1)
  }, [])

  const limpiarFiltros = useCallback(() => {
    setFiltros({ busqueda: null, categoria_id: null, solo_con_stock: true })
    setPage(1)
  }, [])

  return {
    productos, categorias, loading, error,
    filtros, actualizarFiltro, limpiarFiltros,
    page, setPage, totalPages,
  }
}
