import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCatalogo } from './useCatalogo';
import api from '../services/api';

// Mock de la API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useCatalogo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar categorías y productos al inicio', async () => {
    const mockCategories = [{ id: 1, nombre: 'Perros' }];
    const mockProducts = {
      items: [{ id: 1, nombre: 'Comida' }],
      total_pages: 1,
    };

    api.get.mockImplementation((url) => {
      if (url === '/catalog/categories') return Promise.resolve({ data: mockCategories });
      if (url === '/catalog/products') return Promise.resolve({ data: mockProducts });
      return Promise.reject(new Error('URL no encontrada'));
    });

    const { result } = renderHook(() => useCatalogo());

    // Inicialmente cargando
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categorias).toEqual(mockCategories);
    expect(result.current.productos).toEqual(mockProducts.items);
  });

  it('debe manejar errores en la carga de productos', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/catalog/categories') return Promise.resolve({ data: [] });
      if (url === '/catalog/products') return Promise.reject(new Error('Error'));
      return Promise.reject(new Error('URL no encontrada'));
    });

    const { result } = renderHook(() => useCatalogo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('No se pudo cargar el catálogo. Intentá de nuevo.');
  });
});
