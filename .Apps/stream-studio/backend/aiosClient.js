// Cliente utilitário para o Synkra AIOS Core no backend (CommonJS).

const { ElicitationEngine } = require('aios-core/.aios-core/core');

let engineInstance = null;

function getEngine() {
  if (!engineInstance) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.AIOS_API_KEY;
    if (!apiKey) {
      throw new Error('Defina OPENAI_API_KEY (ou AIOS_API_KEY) no .env para usar o AIOS Core.');
    }
    engineInstance = new ElicitationEngine({
      model: process.env.AIOS_MODEL || 'gpt-4o-mini',
      apiKey
    });
  }
  return engineInstance;
}

/**
 * Executa uma elicitação simples com system + mensagem do usuário.
 * @param {string} system
 * @param {string} userContent
 * @returns {Promise<string>}
 */
async function runPrompt(system, userContent) {
  const engine = getEngine();
  const result = await engine.run({
    system,
    messages: [{ role: 'user', content: userContent }]
  });
  return result?.content || '';
}

module.exports = {
  getEngine,
  runPrompt
};
