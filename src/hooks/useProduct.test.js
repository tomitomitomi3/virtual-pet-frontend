import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProduct } from './useProduct';
import api from '../services/api';

// Mock de la API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar un producto por ID', async () => {
    const mockProduct = { id: 1, nombre: 'Producto Test' };
    api.get.mockResolvedValue({ data: mockProduct });

    const { result } = renderHook(() => useProduct(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(api.get).toHaveBeenCalledWith('/catalog/products/1');
  });

  it('debe manejar error al cargar un producto', async () => {
    api.get.mockRejectedValue(new Error('404'));

    const { result } = renderHook(() => useProduct(999));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('No se pudo cargar el producto. Intentá de nuevo.');
  });
});
