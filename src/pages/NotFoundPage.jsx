import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-brand-500">404</h1>
        <h2 className="text-3xl font-semibold mt-4 text-gray-800">Página no encontrada</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-brand-500 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
