import { test, expect } from '@playwright/test';

test('Flujo completo: Cliente compra y Operario recibe en tiempo real', async ({ browser }) => {
  // Aumentamos el timeout ya que orquestamos dos apps y dependemos de la API/WS
  test.setTimeout(120000);

  // 1. Contextos independientes para simular dos usuarios distintos
  const clienteCtx = await browser.newContext();
  const operarioCtx = await browser.newContext();

  const clientePage = await clienteCtx.newPage();
  const operarioPage = await operarioCtx.newPage();

  // 2. Operario entra al Depósito (Admin) en el puerto 5174
  console.log('🚀 Iniciando login del Operario...');
  try {
    await operarioPage.goto('http://localhost:5174/login');
    await operarioPage.fill('input[type="email"]', 'admin@virtualpet.com.ar');
    await operarioPage.fill('input[type="password"]', 'Admin1234');
    await operarioPage.click('button[type="submit"]');
    
    // Esperar a entrar al Board de gestión
    await expect(operarioPage.locator('text=Gestión de Depósito')).toBeVisible({ timeout: 15000 });
    console.log('✅ Operario logueado en Depósito');
  } catch (error) {
    console.error('❌ Error en el login del Operario. Verifica que el Depósito (5174) y el Backend estén corriendo.');
    throw error;
  }

  // 3. Cliente entra a la Tienda
  console.log('🚀 Iniciando login del Cliente...');
  await clientePage.goto('/');
  await clientePage.click('text=Iniciar sesión');
  
  await clientePage.fill('input[type="email"]', 'cliente@test.com');
  await clientePage.fill('input[type="password"]', 'Cliente1234');
  await clientePage.locator('form').getByRole('button', { name: /Iniciar Sesión/i }).click();
  
  // Verificamos login exitoso esperando que aparezca el nombre del usuario (ej. María)
  await expect(clientePage.locator('text=María')).toBeVisible({ timeout: 10000 });
  console.log('✅ Cliente logueado en Tienda');

  // 4. Compra en el Catálogo
  await clientePage.goto('/catalogo');
  console.log('🛒 Navegando al catálogo...');
  
  // Esperar a que carguen los productos
  await clientePage.waitForSelector('article', { timeout: 15000 });
  
  // Agregar el primer producto al carrito
  await clientePage.locator('article').first().getByRole('button', { name: /Agregar/i }).click();
  console.log('✅ Producto agregado');

  // Abrir y completar checkout
  await clientePage.getByRole('button', { name: /Carrito/i }).click();
  await expect(clientePage.getByRole('heading', { name: 'Tu Carrito', exact: true })).toBeVisible();

  // Usamos un identificador único para la calle para evitar colisiones con pedidos previos
  const idUnico = Date.now().toString().slice(-6);
  const calleUnica = `Calle ${idUnico}`;
  
  console.log(`📝 Completando datos de envío: ${calleUnica}`);
  await clientePage.locator('input[name="calle"]').fill(calleUnica);
  await clientePage.locator('input[name="numero"]').fill('123');
  await clientePage.locator('input[name="ciudad"]').fill('Mar del Plata');
  await clientePage.locator('input[name="provincia"]').fill('Buenos Aires');
  
  await clientePage.getByRole('button', { name: /Finalizar Compra/i }).click();
  
  // Verificación de éxito en la tienda
  await expect(clientePage.locator('text=¡Pedido realizado!')).toBeVisible({ timeout: 20000 });
  console.log('✅ Compra finalizada en Tienda');

  // 5. Verificación en tiempo real en el Depósito (WebSocket)
  console.log(`⏳ Esperando que el pedido con calle "${calleUnica}" aparezca en el Depósito...`);
  
  // El pedido debe aparecer en la columna "Pendiente"
  // Buscamos específicamente la calle única que generamos
  await expect(operarioPage.locator(`text=${calleUnica}`)).toBeVisible({ timeout: 30000 });
  
  console.log('🎉 ¡EXITO! Sincronización verificada: El pedido llegó al depósito en tiempo real.');
});


