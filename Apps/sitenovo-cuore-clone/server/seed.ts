import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getDb } from './db.js';

// URLs de imagem padrão — vazias para novos installs (usuária sobe as próprias pelo admin)
const HERO_BG = '';
const PRODUTO1_IMG = '';
const PRODUTO2_IMG = '';
const PRODUTO3_IMG = '';
const BOX_IMG = '';

const DEFAULTS: Record<string, string> = {
  'navbar.brand': 'CUORE',
  'navbar.logo_image': '',
  'banner.text': 'Compre direto pelo WhatsApp de forma humanizada e sem complicação',
  'hero.subtitle': 'Nova Coleção',
  'hero.title': 'Quitanda Brasileira',
  'hero.tagline': 'Cuidar de si é o primeiro passo para se amar.',
  'hero.cta_text': 'Comprar pelo WhatsApp',
  'hero.bg_image': HERO_BG,
  'produto1.title': 'Sabonetes',
  'produto1.subtitle': 'Limpeza gentil e aromática',
  'produto1.image': PRODUTO1_IMG,
  'produto2.title': 'Óleos Essenciais',
  'produto2.subtitle': 'Concentração pura da natureza',
  'produto2.image': PRODUTO2_IMG,
  'produto3.title': 'Hidratação',
  'produto3.subtitle': 'Nutrição profunda para a pele',
  'produto3.image': PRODUTO3_IMG,
  'assinatura.title': 'Conversar para Cuidar',
  'assinatura.description': 'Seu ritual de autocuidado começa com uma conversa. Sem robôs, sem formulários complicados.',
  'assinatura.step1_title': '1. Quer fazer seu Pedido?',
  'assinatura.step1_desc': 'Já escolheu os produtos que vão fazer parte da sua rotina de autocuidado. Já sabe: só chamar no whatsApp',
  'assinatura.step2_title': '2. Fale Conosco',
  'assinatura.step2_desc': 'Chame nossa equipe no WhatsApp. Vamos personalizar seu pedido e combinar o pagamento diretamente com você.',
  'assinatura.step3_title': '3. Receba com Carinho',
  'assinatura.step3_desc': 'Após a conversa, preparamos sua caixa perfumada. Você acompanha o envio e a entrega pelo chat.',
  'assinatura.quote': 'Todos os meses nós preparamos uma box maravilhosa para você com os melhores produtos da Cuore, um mimo especial e claro! Uma surpresa que eu sei que você vai amar. Quer a sua? Já sabe, só chamar no whatsapp',
  'assinatura.cta_text': 'Quero a minha box',
  'assinatura.box_image': BOX_IMG,
  'footer.description': 'Cosméticos naturais e artesanais, feitos com amor e respeito pela natureza brasileira.',
  'footer.copyright': '© 2025 Cuore Terapia Verde. Todos os direitos reservados.',
  'social.instagram_url': '#',
  'social.tiktok_url': '#',
  'social.whatsapp_number': '5511999999999',
  'social.whatsapp_message': 'Olá! Vim pelo site e gostaria de saber mais sobre os produtos da Cuore.',
  'eventos.title': 'Vem sentir a Cuore de Perto',
  'eventos.subtitle': 'Cada evento é um convite para você escolher cuidado. Venha nos encontrar.',
};

async function seed() {
  const db = getDb();

  const insertSetting = db.prepare(
    'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)'
  );
  const insertMany = db.transaction((entries: [string, string][]) => {
    for (const [key, value] of entries) {
      insertSetting.run(key, value);
    }
  });
  insertMany(Object.entries(DEFAULTS));
  console.log(`✅ Settings: ${Object.keys(DEFAULTS).length} defaults inseridos`);

  const email = process.env.ADMIN_EMAIL || 'cuoreterapiaverdeadm@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'cuore2026';

  const existing = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(email);
  if (!existing) {
    const hash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)').run(email, hash);
    console.log(`✅ Admin criado: ${email}`);
  } else {
    console.log(`ℹ️  Admin já existe: ${email}`);
  }

  console.log('🌱 Seed concluído!');
}

seed().catch(console.error);
