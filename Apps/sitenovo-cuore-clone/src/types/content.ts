export interface SiteSettings {
  'navbar.brand': string;
  'navbar.logo_image': string;
  'banner.text': string;
  'hero.subtitle': string;
  'hero.title': string;
  'hero.tagline': string;
  'hero.cta_text': string;
  'hero.bg_image': string;
  'produto1.title': string;
  'produto1.subtitle': string;
  'produto1.image': string;
  'produto2.title': string;
  'produto2.subtitle': string;
  'produto2.image': string;
  'produto3.title': string;
  'produto3.subtitle': string;
  'produto3.image': string;
  'assinatura.title': string;
  'assinatura.description': string;
  'assinatura.step1_title': string;
  'assinatura.step1_desc': string;
  'assinatura.step2_title': string;
  'assinatura.step2_desc': string;
  'assinatura.step3_title': string;
  'assinatura.step3_desc': string;
  'assinatura.quote': string;
  'assinatura.cta_text': string;
  'assinatura.box_image': string;
  'footer.description': string;
  'footer.copyright': string;
  'social.instagram_url': string;
  'social.tiktok_url': string;
  'social.whatsapp_number': string;
  'social.whatsapp_message': string;
  'eventos.title': string;
  'eventos.subtitle': string;
}

export interface CuoreEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  city: string;
  is_free: number; // 1 = gratuito, 0 = pago
}

export const SITE_DEFAULTS: SiteSettings = {
  'navbar.brand': 'CUORE',
  'navbar.logo_image': '',
  'banner.text': 'Compre direto pelo WhatsApp de forma humanizada e sem complicação',
  'hero.subtitle': 'Nova Coleção',
  'hero.title': 'Quitanda Brasileira',
  'hero.tagline': 'Cuidar de si é o primeiro passo para se amar.',
  'hero.cta_text': 'Comprar pelo WhatsApp',
  'hero.bg_image': '',
  'produto1.title': 'Sabonetes',
  'produto1.subtitle': 'Limpeza gentil e aromática',
  'produto1.image': '',
  'produto2.title': 'Óleos Essenciais',
  'produto2.subtitle': 'Concentração pura da natureza',
  'produto2.image': '',
  'produto3.title': 'Hidratação',
  'produto3.subtitle': 'Nutrição profunda para a pele',
  'produto3.image': '',
  'assinatura.title': 'Conversar para Cuidar',
  'assinatura.description': 'Seu ritual de autocuidado começa com uma conversa.',
  'assinatura.step1_title': '1. Quer fazer seu Pedido?',
  'assinatura.step1_desc': 'Já escolheu os produtos. Só chamar no WhatsApp.',
  'assinatura.step2_title': '2. Fale Conosco',
  'assinatura.step2_desc': 'Chame nossa equipe no WhatsApp.',
  'assinatura.step3_title': '3. Receba com Carinho',
  'assinatura.step3_desc': 'Preparamos sua caixa perfumada com carinho.',
  'assinatura.quote': 'Todos os meses nós preparamos uma box maravilhosa para você.',
  'assinatura.cta_text': 'Quero a minha box',
  'assinatura.box_image': '',
  'footer.description': 'Cosméticos naturais e artesanais, feitos com amor.',
  'footer.copyright': '© 2025 Cuore Terapia Verde. Todos os direitos reservados.',
  'social.instagram_url': '#',
  'social.tiktok_url': '#',
  'social.whatsapp_number': '5511999999999',
  'social.whatsapp_message': 'Olá! Vim pelo site e gostaria de saber mais sobre os produtos da Cuore.',
  'eventos.title': 'Vem sentir a Cuore de Perto',
  'eventos.subtitle': 'Cada evento é um convite para você escolher cuidado. Venha nos encontrar.',
};
