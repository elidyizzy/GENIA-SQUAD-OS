import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Credenciais inválidas');
        return;
      }
      const { token } = await res.json();
      localStorage.setItem('cuore_admin_token', token);
      navigate('/admin/dashboard');
    } catch {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Leaf className="text-primary" size={32} />
          <span className="text-2xl font-display font-black text-text-main">CUORE ADMIN</span>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#e0e6db] p-8 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-text-main text-center mb-2">Entrar no painel</h1>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 border border-red-200">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-[#e0e6db] rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
              placeholder="admin@cuoreterapia.com.br"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border border-[#e0e6db] rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-primary hover:bg-primary-dark text-text-main font-bold py-3 rounded-full transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-xs text-text-secondary mt-4">
          <a href="/" className="hover:text-primary transition-colors">← Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}
