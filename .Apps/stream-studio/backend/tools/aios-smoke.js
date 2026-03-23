// Smoke test CLI para Synkra AIOS Core no backend.
// Uso: node tools/aios-smoke.js "pergunta opcional"

const { runPrompt } = require('../aiosClient');

const userContent = process.argv[2] || 'Diga olá em uma frase curta.';

(async () => {
  try {
    const text = await runPrompt(
      'Você é um agente de verificação do estúdio, responda em português.',
      userContent
    );
    console.log('Resposta AIOS:', text);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao rodar smoke do AIOS:', err.message);
    process.exit(1);
  }
})();
