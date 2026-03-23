import { Link } from 'react-router-dom';
import { Image, ShoppingBag, Heart, Footprints, Settings, User, ExternalLink } from 'lucide-react';

const sections = [
  { to: '/admin/hero', label: 'Banner Hero', desc: 'Título, subtítulo, tagline e imagem de fundo', icon: <Image size={22} className="text-primary" /> },
  { to: '/admin/navbar', label: 'Navbar', desc: 'Nome da marca e aviso do topo', icon: <Settings size={22} className="text-primary" /> },
  { to: '/admin/produtos', label: 'Produtos', desc: 'Nome, descrição e imagem das 3 categorias', icon: <ShoppingBag size={22} className="text-primary" /> },
  { to: '/admin/assinatura', label: 'Seção Assinatura', desc: 'Passos, depoimento e imagem da box', icon: <Heart size={22} className="text-primary" /> },
  { to: '/admin/footer', label: 'Rodapé & Redes Sociais', desc: 'WhatsApp, Instagram, TikTok e textos do rodapé', icon: <Footprints size={22} className="text-primary" /> },
  { to: '/admin/conta', label: 'Minha Conta', desc: 'Alterar senha de acesso ao admin', icon: <User size={22} className="text-primary" /> },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-black text-text-main">Dashboard</h1>
        <p className="text-text-secondary mt-1">Gerencie todo o conteúdo do site Cuore Terapia Verde.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(s => (
          <Link
            key={s.to}
            to={s.to}
            className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#e0e6db] hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              {s.icon}
            </div>
            <div>
              <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{s.label}</h3>
              <p className="text-sm text-text-secondary mt-0.5">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-5 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between">
        <div>
          <p className="font-bold text-text-main">Ver o site ao vivo</p>
          <p className="text-sm text-text-secondary">Abrir o site em uma nova aba</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-primary text-text-main font-bold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors text-sm"
        >
          Abrir <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
