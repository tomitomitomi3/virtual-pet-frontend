import { useState, useEffect } from 'react'
import api from '../services/api'

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setError(null)

    api.get(`/catalog/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => setError('No se pudo cargar el producto. Intentá de nuevo.'))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}
