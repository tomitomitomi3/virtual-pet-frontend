import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('debe renderizar el título 404 y el mensaje de error', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
    expect(
      screen.getByText(/Lo sentimos, la página que estás buscando no existe/i)
    ).toBeInTheDocument();
  });

  it('debe contener un enlace para volver al inicio', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    const link = screen.getByRole('link', { name: /volver al inicio/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
