# Guía de Testing - Virtual Pet Frontend

Este proyecto utiliza **Vitest** y **React Testing Library** para las pruebas unitarias y de componentes.

## Stack de Testing
- **Vitest**: El framework de ejecución de pruebas (compatible con Jest y nativo para Vite).
- **React Testing Library**: Para renderizar y testear componentes de React desde la perspectiva del usuario.
- **jsdom**: Entorno de navegador simulado para Node.js.
- **jest-dom**: Matchers adicionales para realizar aserciones sobre el DOM (ej. `.toBeInTheDocument()`).

## Requisitos Previos
Asegúrate de haber instalado las dependencias de desarrollo:
```bash
npm install
```

## Cómo ejecutar los tests

### 1. Modo de Observación (Watch Mode)
Es el modo recomendado durante el desarrollo. Los tests se vuelven a ejecutar automáticamente cuando guardas un cambio.
```bash
npm test
```

### 2. Ejecución Única (CI/Production)
Para ejecutar todos los tests una sola vez y finalizar el proceso (ideal para pipelines de CI/CD).
```bash
npm test -- --run
```

### 3. Con Reporte de Cobertura (Opcional)
Si deseas ver qué porcentaje de tu código está cubierto por los tests:
```bash
npm test -- --coverage
```
*(Nota: La primera vez te pedirá instalar un paquete adicional de cobertura como `@vitest/coverage-v8`)*.

## Estructura de los Tests
Los archivos de prueba deben seguir la convención `*.test.jsx` o `*.spec.jsx`.
- Ejemplo: `src/pages/NotFoundPage.test.jsx`

## Configuración Global
La configuración global se encuentra en:
- `vite.config.js`: Configuración del entorno de Vitest.
- `src/setupTests.js`: Importación de extensiones para las aserciones del DOM.
