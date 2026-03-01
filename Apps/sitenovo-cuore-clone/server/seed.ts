import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getDb } from './db.js';

const HERO_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzvLbTueYOB4B3s1N7YB9b6EuG4gxMucVmau2rO9x5yoNAIKudAY-b3p0zuXPfEIS7sdDyjUQlXvtyXCwJ_vzlNsDllrkMxC_4xfl5zBj4KaK9JChYsHRmVRT1KSP6W3wX7AVB28H0XXTEHqqXYlV0VErKU2hDYyQzlmka6jTYC8oBJMouE1a5G5kMuupEfiSf7-tmKS52oeOknBEINpbMflpihUR8fB0UMVZcsrktkmkR9p70SFiOtiFE2Qwf7GPmW_Ngc34p2wIi';
const PRODUTO1_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-owbWmgXo4zfwPXznCuMp87-oQ_iDojnCZHeiJVhXGTBmyBLpKJsvknw65TxyPTqe-hNTd5uVNora8I0F-f_2MvNf28Qy0C5gJHPJELIvs6uscWwOVc0nrHtX7OiC_-xyYwMxKuNmNqTkLBFvXbmohOEu-hCzty7tR2qsc6auT-DF1DI2R9bn15_4pZo50-FSSWjpLhfZenxFGbCk4ixnHbU5iWhskI50a-RaKwQ_atwfKxUWUcSwP-l5DIZKKMfNYknVlqH2VKk2';
const PRODUTO2_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIcJ_sMcVg24_NbsEjVA1B5tXfh9ctjUkVFcXCmB1SIBJVUMFqPe4KumkGeMhKj_e5pnPWiHhT7SrZBehraUQ4EJbtH_UcpwLjh2eQZSqFNWXkntA2WCkQ4pFzZc2-cmhMYcwWRz3oX_r9om_BoXYtI6uKRcpwlB8tDIsWTergzeZ5vtxA21AGDwoajfUZ_Eq5nG0nfk8y-etzxB0t3u5ZJW58qM5xQVgrtSlDE7LOm731v3KW_HV0oflxPpexizH_6FDE4Qb_ym7L';
const PRODUTO3_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaylF_ca53UNvUlId16Ir-UEk1r0UQWx6KhRdxXREjmLq8ZBczR-DslIVsZKBVX9o60PyJS_yNOz_7slL2SJKiL6Grh72d2TbknxMSzy8F21JvnJtCqPl06WWuDoZv6lvxaQRFKmIWpL1vFbhoF4iH_egGU0GVKji_E7tO2Hj5rZ1uY2gN80RQYhZahMTJNiqqcPFg7suejJbH1_J4HM3YKiVjbt_gqJ6yjg5H_Mr87rIxR0hnyi-zHibSSYDPyIDgobFMKloS74Hd';
const BOX_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDec9zlyB03EQ1hdUDZvSe-LJdR6bztR4saIN5ZAWmUIP9c1XDTL_dv6bUWURIOJhLWBeX3wExlL308KCHufODACfVIlqrArusasRO6WNXcCU5PyhhQImPVlFSzgy7VGe4Bcr8qo7roMrzTuKNzzPUogv2cgzryatnCl7pP6ei9g4OBcmuZwyX7msiduVxJR_Rgx7PFH39YIwroe_OmAZs3BFsazm1hlSNzIk6p7LtTzPaXH3btoFFRMwmtkWyefQvdMVQvKo-0gq6X';

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
