import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from './authStore';
import api from '../services/api';

// Mock de la API
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Limpiar localStorage y resetear el store antes de cada test
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, error: null, loading: false });
    vi.clearAllMocks();
  });

  it('debe iniciar sesión correctamente y guardar en localStorage', async () => {
    const mockLoginResponse = {
      data: {
        access_token: 'fake-token'
      }
    };
    const mockUserResponse = {
      data: { id: 1, email: 'test@test.com', nombre: 'Test' }
    };
    api.post.mockResolvedValue(mockLoginResponse);
    api.get.mockResolvedValue(mockUserResponse);

    const success = await useAuthStore.getState().login('test@test.com', 'password');

    expect(success).toBe(true);
    expect(useAuthStore.getState().token).toBe('fake-token');
    expect(useAuthStore.getState().user).toEqual(mockUserResponse.data);
    expect(localStorage.getItem('vp_token')).toBe('fake-token');
  });

  it('debe manejar errores de inicio de sesión', async () => {
    const errorResponse = {
      response: {
        data: { detail: 'Credenciales inválidas' }
      }
    };
    api.post.mockRejectedValue(errorResponse);

    const success = await useAuthStore.getState().login('test@test.com', 'wrong');

    expect(success).toBe(false);
    expect(useAuthStore.getState().error).toBe('Credenciales inválidas');
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('debe cerrar sesión y limpiar localStorage', () => {
    // Simular estado autenticado
    localStorage.setItem('vp_token', 'token');
    useAuthStore.setState({ token: 'token', user: { id: 1 } });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem('vp_token')).toBeNull();
  });

  it('debe registrarse correctamente', async () => {
    const mockResponse = {
      data: {
        access_token: 'new-token',
        user: { id: 2, email: 'new@test.com', nombre: 'New' }
      }
    };
    api.post.mockResolvedValue(mockResponse);

    const success = await useAuthStore.getState().register('New', 'User', 'new@test.com', 'password');

    expect(success).toBe(true);
    expect(useAuthStore.getState().token).toBe('new-token');
    expect(localStorage.getItem('vp_token')).toBe('new-token');
  });

  it('debe actualizar el perfil correctamente', async () => {
    const updatedUser = { id: 1, email: 'test@test.com', nombre: 'Updated', apellido: 'Name' };
    api.patch.mockResolvedValue({ data: updatedUser });

    const success = await useAuthStore.getState().updateProfile('Updated', 'Name');

    expect(success).toBe(true);
    expect(useAuthStore.getState().user).toEqual(updatedUser);
    expect(JSON.parse(localStorage.getItem('vp_user'))).toEqual(updatedUser);
  });

  it('debe cambiar la contraseña correctamente', async () => {
    api.patch.mockResolvedValue({});

    const success = await useAuthStore.getState().changePassword('oldPass', 'newPass123');

    expect(success).toBe(true);
    expect(api.patch).toHaveBeenCalledWith('/auth/me/password', {
      current_password: 'oldPass',
      new_password: 'newPass123'
    });
  });
});
