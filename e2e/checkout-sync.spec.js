import { test, expect } from '@playwright/test';

test('Flujo completo: Cliente compra y Operario recibe en tiempo real', async ({ browser }) => {
  // Aumentamos el timeout para este test específico ya que orquestamos dos apps
  test.setTimeout(60000);

  // 1. Contextos independientes
  const clienteCtx = await browser.newContext();
  const operarioCtx = await browser.newContext();

  const clientePage = await clienteCtx.newPage();
  const operarioPage = await operarioCtx.newPage();

  // 2. Operario entra al Depósito (Admin)
  await operarioPage.goto('http://localhost:5174/login');
  await operarioPage.fill('input[type="email"]', 'admin@virtualpet.com.ar');
  await operarioPage.fill('input[type="password"]', 'Admin1234');
  await operarioPage.click('button[type="submit"]');
  await expect(operarioPage).toHaveURL('http://localhost:5174/');
  console.log('✅ Operario logueado en Depósito');

  // 3. Cliente entra a la Tienda y se loguea
  await clientePage.goto('http://localhost:5173/');
  await clientePage.click('text=Iniciar sesión'); // Texto exacto del Navbar
  await clientePage.fill('input[type="email"]', 'cliente@test.com');
  await clientePage.fill('input[type="password"]', 'Cliente1234');
  
  // Especificamos que queremos el botón que está DENTRO del formulario del modal
  await clientePage.locator('form').getByRole('button', { name: /Iniciar Sesión/i }).click();
  
  // Esperar a que el modal desaparezca
  await expect(clientePage.locator('text=Bienvenido de nuevo')).not.toBeVisible({ timeout: 10000 });
  console.log('✅ Cliente logueado en Tienda');

  // Navegar a la página de catálogo
  await clientePage.goto('http://localhost:5173/catalogo');

  // 4. Compra
  await clientePage.waitForSelector('article', { timeout: 15000 });
  await clientePage.locator('article').first().scrollIntoViewIfNeeded();
  
  // Click en agregar
  await clientePage.getByRole('button', { name: /Agregar/i }).first().click();
  console.log('✅ Producto agregado al carrito');

  // Abrir el carrito
  await clientePage.getByRole('button', { name: /Carrito/i }).click();
  
  // Esperar el Drawer
  await expect(clientePage.getByRole('heading', { name: 'Tu Carrito', exact: true })).toBeVisible();

  // Generar una dirección única y legible (usamos los últimos 4 dígitos del timestamp)
  const idUnico = Date.now().toString().slice(-4);
  const calleUnica = `Calle Playwright`;
  const ciudadUnica = `Mar del Plata`;
  // La dirección completa concatenada será lo que buscaremos después
  const direccionUnica = `${calleUnica} ${idUnico}, ${ciudadUnica}`;

  // Llenar dirección dividida
  await clientePage.getByPlaceholder(/Calle/i).fill(calleUnica);
  await clientePage.getByPlaceholder(/N°/i).fill(idUnico);
  await clientePage.getByPlaceholder(/Ciudad/i).fill(ciudadUnica);
  await clientePage.getByPlaceholder(/Provincia/i).fill('Buenos Aires');
  
  await clientePage.getByRole('button', { name: /Finalizar Compra/i }).click();
  
  // 5. Verificación Dual
  await expect(clientePage.locator('text=¡Pedido realizado!')).toBeVisible();
  console.log('✅ Compra finalizada en Tienda');

  // En el depósito: la nueva orden debe aparecer (vía WebSocket)
  // Al ser una dirección única, Playwright no se confundirá con pedidos viejos
  await expect(operarioPage.locator(`text=${direccionUnica}`)).toBeVisible({ timeout: 20000 });
  console.log('✅ ¡Integración exitosa! El pedido llegó al depósito en tiempo real.');
  console.log('El pedido es el de direccion: ', direccionUnica);

  // Pausa final para que puedas mostrar el resultado en la presentación
  console.log('📽️  Test pausado. Cerrar el inspector de Playwright para terminar.');
  await operarioPage.pause();
});
