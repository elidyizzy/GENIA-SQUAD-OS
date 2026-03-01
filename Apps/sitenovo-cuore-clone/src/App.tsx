import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Leaf, Search, Heart, MessageCircle, ArrowRight, Sparkles, Sprout, MapPin, Calendar } from 'lucide-react';
import { useSiteContent, buildWhatsAppUrl } from './hooks/useSiteContent';
import { SiteSettings, CuoreEvent } from './types/content';
import { WhatsAppButton } from './components/WhatsAppButton';

// Admin carregado em lazy (não afeta bundle do site público)
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminGuard = lazy(() => import('./admin/AdminGuard'));

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ s, whatsappUrl }: { s: SiteSettings; whatsappUrl: string }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e6db] bg-background-light/95 backdrop-blur-sm px-6 py-4 lg:px-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-text-main">
          {s['navbar.logo_image'] ? (
            <img
              src={s['navbar.logo_image']}
              alt={s['navbar.brand']}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <>
              <div className="size-8 flex items-center justify-center text-primary">
                <Leaf size={32} />
              </div>
              <h2 className="text-text-main text-xl font-display font-black leading-tight tracking-[-0.015em]">
                {s['navbar.brand']}
              </h2>
            </>
          )}
        </div>
        <nav className="hidden lg:flex items-center gap-8 ml-4">
          <a className="text-text-secondary hover:text-primary text-sm font-medium transition-colors" href="#">Home</a>
          <a className="text-text-secondary hover:text-primary text-sm font-medium transition-colors" href="#">Coleção</a>
          <a className="text-text-secondary hover:text-primary text-sm font-medium transition-colors" href="#">Sobre Nós</a>
          <a className="text-text-secondary hover:text-primary text-sm font-medium transition-colors" href="#">Contato</a>
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-4 sm:gap-6 items-center">
        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64 group">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-white border border-[#e0e6db] focus-within:border-primary transition-colors">
            <div className="text-text-secondary flex items-center justify-center pl-4 pr-2">
              <Search size={20} />
            </div>
            <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full text-text-main bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-text-secondary/50 text-sm font-normal" placeholder="Buscar produtos..." />
          </div>
        </label>
        <div className="flex gap-3">
          <button className="md:hidden flex items-center justify-center rounded-full size-10 bg-white text-text-main hover:bg-primary/10 transition-colors">
            <Search size={20} />
          </button>
          <button className="flex items-center justify-center rounded-full size-10 bg-white text-text-main hover:bg-primary/10 transition-colors relative">
            <Heart size={20} />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full size-10 bg-white text-text-main hover:bg-primary/10 transition-colors relative"
            title="Falar no WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ s, whatsappUrl }: { s: SiteSettings; whatsappUrl: string }) {
  return (
    <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 py-6 flex flex-col gap-10 mx-auto">
      <div className="w-full">
        <div
          className="relative flex min-h-[560px] flex-col gap-6 overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat p-8 md:p-12 items-center justify-center text-center shadow-lg"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 24, 17, 0.3) 0%, rgba(20, 24, 17, 0.6) 100%), url("${s['hero.bg_image']}")`,
          }}
        >
          <div className="flex flex-col gap-4 max-w-3xl z-10">
            <h2 className="text-white/90 text-sm md:text-base font-medium uppercase tracking-widest">
              {s['hero.subtitle']}
            </h2>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight drop-shadow-md">
              {s['hero.title']}
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-light max-w-xl mx-auto mt-2 leading-relaxed">
              {s['hero.tagline']}
            </p>
          </div>
          <div className="mt-4 z-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-text-main text-base font-bold transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{s['hero.cta_text']}</span>
              <MessageCircle size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Produtos ─────────────────────────────────────────────────────────────────

function ProdutoCard({ title, subtitle, image, whatsappUrl }: { title: string; subtitle: string; image: string; whatsappUrl: string; offset?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-lg aspect-[4/5] group cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-6 left-6 text-white w-[calc(100%-3rem)]">
        <h3 className="text-xl font-display font-bold">{title}</h3>
        <p className="text-sm text-white/80 mt-1">{subtitle}</p>
        <div className="mt-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-text-main text-xs font-bold py-2 px-4 rounded-full flex items-center gap-1 w-fit cursor-pointer"
          >
            Ver Produtos <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Produtos({ s, whatsappUrl }: { s: SiteSettings; whatsappUrl: string }) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProdutoCard title={s['produto1.title']} subtitle={s['produto1.subtitle']} image={s['produto1.image']} whatsappUrl={whatsappUrl} />
        <div className="md:-mt-8">
          <ProdutoCard title={s['produto2.title']} subtitle={s['produto2.subtitle']} image={s['produto2.image']} whatsappUrl={whatsappUrl} />
        </div>
        <ProdutoCard title={s['produto3.title']} subtitle={s['produto3.subtitle']} image={s['produto3.image']} whatsappUrl={whatsappUrl} />
      </div>
    </div>
  );
}

// ─── Eventos ──────────────────────────────────────────────────────────────────

function Eventos({ s, whatsappUrl, events }: { s: SiteSettings; whatsappUrl: string; events: CuoreEvent[] }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-24 px-4 lg:px-10 bg-[#0f1a0b] relative overflow-hidden">
      {/* Detalhe decorativo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <Calendar size={14} className="text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Agenda</span>
          </div>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight mb-5">
            {s['eventos.title']}
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto leading-relaxed">
            {s['eventos.subtitle']}
          </p>
        </div>

        {/* Lista de eventos */}
        <div className="flex flex-col gap-3 mb-14">
          {events.map((event) => {
            const [year, month, day] = event.date.split('-');
            const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            const monthName = monthNames[parseInt(month, 10) - 1] ?? month;
            return (
              <div
                key={event.id}
                className="group flex items-center gap-5 md:gap-8 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-primary/30 rounded-2xl p-5 md:p-6 transition-all duration-300"
              >
                {/* Badge data */}
                <div className="flex-shrink-0 w-14 text-center">
                  <div className="text-3xl md:text-4xl font-display font-black text-primary leading-none">{day}</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mt-0.5 font-medium">{monthName}</div>
                  {year && <div className="text-[10px] text-white/25 mt-0.5">{year}</div>}
                </div>

                {/* Linha divisória */}
                <div className="w-px self-stretch bg-white/10 flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base md:text-lg leading-tight truncate">{event.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    {event.location && (
                      <span className="flex items-center gap-1.5 text-white/45 text-sm">
                        <MapPin size={13} className="text-primary/60 flex-shrink-0" />
                        {event.location}
                      </span>
                    )}
                    {event.city && (
                      <span className="text-white/30 text-sm">{event.city}</span>
                    )}
                    {event.time && (
                      <span className="text-white/30 text-sm">· {event.time}</span>
                    )}
                  </div>
                </div>

                {/* Tag gratuito ou botão pago */}
                {event.is_free ? (
                  <span className="flex-shrink-0 text-[11px] font-bold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 whitespace-nowrap">
                    Evento Gratuito
                  </span>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-white transition-colors whitespace-nowrap"
                    onClick={e => e.stopPropagation()}
                  >
                    <MessageCircle size={12} />
                    Garantir minha vaga
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-white/35 text-sm mb-6">Quer saber onde nos encontrar? Fale com a gente.</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-text-main font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5"
          >
            <MessageCircle size={20} />
            Quero saber mais sobre os eventos
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Assinatura ───────────────────────────────────────────────────────────────

function Assinatura({ s, whatsappUrl }: { s: SiteSettings; whatsappUrl: string }) {
  return (
    <section className="py-20 px-4 lg:px-10 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-text-main md:text-4xl lg:text-5xl">
            {s['assinatura.title']}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            {s['assinatura.description']}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {[
            { icon: <Sprout size={32} />, title: s['assinatura.step1_title'], desc: s['assinatura.step1_desc'] },
            { icon: <MessageCircle size={32} />, title: s['assinatura.step2_title'], desc: s['assinatura.step2_desc'] },
            { icon: <Heart size={32} />, title: s['assinatura.step3_title'], desc: s['assinatura.step3_desc'] },
          ].map((step, i) => (
            <div key={i} className="group flex flex-col items-center text-center p-6 rounded-2xl bg-background-light border border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-white text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-main">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="relative flex flex-col md:flex-row items-center rounded-3xl bg-[#f4f7f1] shadow-sm border border-primary/20 z-10 w-full max-w-5xl overflow-hidden">
            <div className="w-full md:w-1/2 h-64 md:h-auto self-stretch relative bg-white">
              <img
                src={s['assinatura.box_image']}
                alt="Box Cuore Terapia Verde"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center text-center p-10 md:p-14">
              <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <Sparkles size={32} />
              </div>
              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-10 font-light italic">
                "{s['assinatura.quote']}"
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 rounded-full bg-primary py-4 text-base font-bold text-text-main hover:bg-primary-dark shadow-lg shadow-primary/20 transition-colors flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{s['assinatura.cta_text']}</span>
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ s }: { s: SiteSettings }) {
  return (
    <footer className="bg-surface-light border-t border-[#e0e6db] mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8 px-6 py-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start gap-4 max-w-xs">
            <div className="flex items-center gap-2 text-text-main">
              {s['navbar.logo_image'] ? (
                <img src={s['navbar.logo_image']} alt={s['navbar.brand']} className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <Leaf className="text-primary" size={28} />
                  <span className="text-lg font-display font-black tracking-tight">{s['navbar.brand']}</span>
                </>
              )}
            </div>
            <p className="text-text-secondary text-sm text-center md:text-left">
              {s['footer.description']}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-12">
            <div className="flex flex-col gap-2">
              <h5 className="text-text-main font-bold text-sm uppercase tracking-wide mb-1">Nossas Redes</h5>
              <a className="text-text-secondary hover:text-primary text-sm transition-colors flex items-center gap-2" href={s['social.instagram_url']} target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.527c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                Instagram
              </a>
              <a className="text-text-secondary hover:text-primary text-sm transition-colors flex items-center gap-2" href={s['social.tiktok_url']} target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" /></svg>
                TikTok
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="text-text-main font-bold text-sm uppercase tracking-wide mb-1">Ajuda</h5>
              <a className="text-text-secondary hover:text-primary text-sm transition-colors" href="#">Envio e Devoluções</a>
              <a className="text-text-secondary hover:text-primary text-sm transition-colors" href="#">Termos de Uso</a>
              <a className="text-text-secondary hover:text-primary text-sm transition-colors" href="#">Privacidade</a>
            </div>
          </div>
        </div>
        <div className="h-px bg-[#e0e6db] w-full" />
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-text-secondary text-xs font-normal">{s['footer.copyright']}</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Site Público ─────────────────────────────────────────────────────────────

function PublicSite() {
  const { settings: s } = useSiteContent();
  const whatsappUrl = buildWhatsAppUrl(s['social.whatsapp_number'], s['social.whatsapp_message']);
  const [events, setEvents] = useState<CuoreEvent[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data: CuoreEvent[]) => setEvents(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary/20 text-text-secondary py-2 text-center text-sm font-medium border-b border-primary/20">
        <p>{s['banner.text']}</p>
      </div>
      <Navbar s={s} whatsappUrl={whatsappUrl} />
      <main className="flex-grow">
        <Hero s={s} whatsappUrl={whatsappUrl} />
        <Produtos s={s} whatsappUrl={whatsappUrl} />
        <Eventos s={s} whatsappUrl={whatsappUrl} events={events} />
        <Assinatura s={s} whatsappUrl={whatsappUrl} />
      </main>
      <Footer s={s} />
      <WhatsAppButton url={whatsappUrl} />
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-secondary">Carregando...</div>}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminGuard />} />
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </Suspense>
  );
}
