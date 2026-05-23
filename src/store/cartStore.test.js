import { describe, it, expect, beforeEach } from 'vitest';
import useCartStore from './cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    useCartStore.getState().vaciar();
  });

  it('debe empezar con el carrito vacío', () => {
    const { items } = useCartStore.getState();
    expect(items).toEqual([]);
  });

  it('debe agregar un producto nuevo al carrito', () => {
    const producto = { id: 1, nombre: 'Producto 1', precio: 100, imagen_url: 'test.jpg' };
    useCartStore.getState().agregar(producto);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      product_id: 1,
      nombre: 'Producto 1',
      precio: 100,
      cantidad: 1
    });
  });

  it('debe incrementar la cantidad si el producto ya existe', () => {
    const producto = { id: 1, nombre: 'Producto 1', precio: 100 };
    useCartStore.getState().agregar(producto);
    useCartStore.getState().agregar(producto);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(2);
  });

  it('debe quitar un producto del carrito', () => {
    const producto = { id: 1, nombre: 'Producto 1', precio: 100 };
    useCartStore.getState().agregar(producto);
    useCartStore.getState().quitar(1);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('debe actualizar la cantidad correctamente', () => {
    const producto = { id: 1, nombre: 'Producto 1', precio: 100 };
    useCartStore.getState().agregar(producto);
    useCartStore.getState().setCantidad(1, 5);

    const { items } = useCartStore.getState();
    expect(items[0].cantidad).toBe(5);
  });

  it('debe quitar el producto si setCantidad es 0 o menor', () => {
    const producto = { id: 1, nombre: 'Producto 1', precio: 100 };
    useCartStore.getState().agregar(producto);
    useCartStore.getState().setCantidad(1, 0);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('debe calcular correctamente el total y la cantidad de items', () => {
    useCartStore.getState().agregar({ id: 1, nombre: 'P1', precio: 100 });
    useCartStore.getState().agregar({ id: 2, nombre: 'P2', precio: 200 });
    useCartStore.getState().setCantidad(1, 2); // 2 * 100 = 200

    expect(useCartStore.getState().cantidadItems()).toBe(3);
    expect(useCartStore.getState().total()).toBe(400);
  });
});
