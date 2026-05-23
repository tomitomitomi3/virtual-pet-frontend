/**
 * Store global del carrito con persistencia en localStorage.
 * El carrito vive en el frontend — la API no lo conoce hasta el checkout.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto) => {
        const items = get().items
        const existe = items.find(i => i.product_id === producto.id)
        if (existe) {
          set({ items: items.map(i => i.product_id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i) })
        } else {
          set({ items: [...items, { product_id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen_url: producto.imagen_url, cantidad: 1 }] })
        }
      },

      quitar: (product_id) => set({ items: get().items.filter(i => i.product_id !== product_id) }),

      setCantidad: (product_id, cantidad) => {
        if (cantidad <= 0) { get().quitar(product_id); return }
        set({ items: get().items.map(i => i.product_id === product_id ? { ...i, cantidad } : i) })
      },

      vaciar: () => set({ items: [] }),
      cantidadItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
      total: () => get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    }),
    { name: 'vp-carrito' }
  )
)

export default useCartStore
