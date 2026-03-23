// Smoke test headless para o StreamStudio
// Requer: npm i -D playwright
// Uso: node scripts/smoke-headless.mjs [URL]
// Ex.: FRONTEND_URL=http://localhost:3000 node scripts/smoke-headless.mjs

import { chromium } from 'playwright';

const FRONTEND_URL = process.env.FRONTEND_URL || process.argv[2] || 'http://localhost:3000';
const roomName = `smoke-room-${Date.now()}`;

async function openClient({ name, isHost }) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream'
    ]
  });

  const context = await browser.newContext({
    permissions: ['microphone', 'camera'],
  });
  const page = await context.newPage();
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });

  // preencher formulário de entrada
  await page.getByLabel('ID da Sala').fill(roomName);
  await page.getByLabel('Seu Nome').fill(name);
  if (isHost) {
    await page.getByLabel('Eu sou o Anfitrião (Transmissor/Gravador)').check();
  }
  await page.getByRole('button', { name: 'Entrar no Estúdio' }).click();

  // espera carregar estúdio (canvas visível para host, grid para todos)
  await page.waitForTimeout(1500);

  return { browser, page, context };
}

async function expectText(page, text) {
  await page.waitForTimeout(300); // pequeno buffer
  const found = await page.getByText(text, { exact: false }).first().isVisible().catch(() => false);
  if (!found) {
    throw new Error(`Texto esperado não encontrado: "${text}"`);
  }
}

async function run() {
  console.log(`Iniciando smoke test em ${FRONTEND_URL} na sala ${roomName}`);

  const host = await openClient({ name: 'Host Bot', isHost: true });
  const guest = await openClient({ name: 'Guest Bot', isHost: false });

  try {
    // Chat bidirecional
    await host.page.getByPlaceholder('Digite uma mensagem...').fill('ping do host');
    await host.page.keyboard.press('Enter');
    await expectText(guest.page, 'ping do host');

    await guest.page.getByPlaceholder('Digite uma mensagem...').fill('pong do guest');
    await guest.page.keyboard.press('Enter');
    await expectText(host.page, 'pong do guest');

    // Controle de áudio: muta e checa rótulo
    await host.page.getByRole('button', { name: /Microfone/ }).click();
    await expectText(host.page, 'Microfone mutado');
    await host.page.getByRole('button', { name: /Microfone/ }).click();
    await expectText(host.page, 'Microfone ligado');

    // Presença de participantes (ao menos 1 remoto em cada lado)
    const hostHasRemote = await host.page.locator('video[id^="remote-"]').count();
    const guestHasRemote = await guest.page.locator('video[id^="remote-"]').count();
    if (hostHasRemote === 0 || guestHasRemote === 0) {
      throw new Error('Vídeo remoto não apareceu para host ou convidado.');
    }

    console.log('✅ Smoke test OK');
  } catch (err) {
    console.error('❌ Smoke test falhou:', err.message);
    process.exitCode = 1;
  } finally {
    await host.browser.close();
    await guest.browser.close();
  }
}

run();
