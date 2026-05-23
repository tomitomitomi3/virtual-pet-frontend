import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './Navbar';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

// Mocks de los stores
vi.mock('../store/authStore');
vi.mock('../store/cartStore');

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Configuración por defecto de los mocks
    useAuthStore.mockReturnValue({
      user: null,
      isLoggedIn: () => false,
    });
    useCartStore.mockReturnValue({
      cantidadItems: () => 0,
    });
  });

  const renderNavbar = (props = {}) => {
    return render(
      <BrowserRouter>
        <Navbar {...props} />
      </BrowserRouter>
    );
  };

  it('debe mostrar el botón de Iniciar Sesión si el usuario no está logueado', () => {
    renderNavbar();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('debe mostrar el nombre del usuario si está logueado', () => {
    useAuthStore.mockReturnValue({
      user: { nombre: 'Juan' },
      isLoggedIn: () => true,
    });

    renderNavbar();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
  });

  it('debe mostrar el contador del carrito si hay items', () => {
    useCartStore.mockReturnValue({
      cantidadItems: () => 5,
    });

    renderNavbar();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('debe llamar a onLoginClick al hacer clic en Iniciar Sesión', () => {
    const onLoginClick = vi.fn();
    renderNavbar({ onLoginClick });

    fireEvent.click(screen.getByText('Iniciar sesión'));
    expect(onLoginClick).toHaveBeenCalled();
  });

  it('debe llamar a onCartClick al hacer clic en el botón Carrito', () => {
    const onCartClick = vi.fn();
    renderNavbar({ onCartClick });

    fireEvent.click(screen.getByRole('button', { name: /carrito/i }));
    expect(onCartClick).toHaveBeenCalled();
  });
});
