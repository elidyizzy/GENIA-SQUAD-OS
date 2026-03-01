import { NavLink, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Leaf, LogOut, LayoutDashboard, Image, ShoppingBag, Heart, Footprints, Settings, User, CalendarDays } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import HeroSettings from './pages/HeroSettings';
import NavbarSettings from './pages/NavbarSettings';
import ProductsSettings from './pages/ProductsSettings';
import AssinaturaSettings from './pages/AssinaturaSettings';
import FooterSettings from './pages/FooterSettings';
import AdminSettings from './pages/AdminSettings';
import EventsSettings from './pages/EventsSettings';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/hero', label: 'Banner Hero', icon: <Image size={18} /> },
  { to: '/admin/navbar', label: 'Navbar', icon: <Settings size={18} /> },
  { to: '/admin/produtos', label: 'Produtos', icon: <ShoppingBag size={18} /> },
  { to: '/admin/eventos', label: 'Agenda', icon: <CalendarDays size={18} /> },
  { to: '/admin/assinatura', label: 'Assinatura', icon: <Heart size={18} /> },
  { to: '/admin/footer', label: 'Rodapé & Redes', icon: <Footprints size={18} /> },
  { to: '/admin/conta', label: 'Minha Conta', icon: <User size={18} /> },
];

export default function AdminApp() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('cuore_admin_token');
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-background-light">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-[#e0e6db] flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-[#e0e6db]">
          <Leaf className="text-primary" size={22} />
          <span className="font-display font-black text-text-main">CUORE</span>
          <span className="text-xs text-text-secondary ml-1">Admin</span>
        </div>
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-text-secondary hover:bg-background-light hover:text-text-main'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-[#e0e6db]">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-primary transition-colors mt-1"
          >
            ↗ Ver site
          </a>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hero" element={<HeroSettings />} />
          <Route path="navbar" element={<NavbarSettings />} />
          <Route path="produtos" element={<ProductsSettings />} />
          <Route path="eventos" element={<EventsSettings />} />
          <Route path="assinatura" element={<AssinaturaSettings />} />
          <Route path="footer" element={<FooterSettings />} />
          <Route path="conta" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
