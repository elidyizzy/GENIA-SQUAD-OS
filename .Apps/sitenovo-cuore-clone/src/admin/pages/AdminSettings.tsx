import React, { useState } from 'react';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', msg: 'As senhas não coincidem' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', msg: 'A nova senha deve ter pelo menos 6 caracteres' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    const token = localStorage.getItem('cuore_admin_token');
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao alterar senha');
      setFeedback({ type: 'success', msg: 'Senha alterada com sucesso!' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-display font-black text-text-main mb-1">Minha Conta</h1>
      <p className="text-text-secondary mb-8">Altere sua senha de acesso ao painel.</p>

      {feedback && (
        <div className={`mb-4 text-sm rounded-lg px-4 py-3 border ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {feedback.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e0e6db] p-6 flex flex-col gap-4">
        {[
          { label: 'Senha atual', value: currentPassword, onChange: setCurrentPassword },
          { label: 'Nova senha', value: newPassword, onChange: setNewPassword },
          { label: 'Confirmar nova senha', value: confirmPassword, onChange: setConfirmPassword },
        ].map(field => (
          <div key={field.label} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">{field.label}</label>
            <input
              type="password"
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              required
              className="border border-[#e0e6db] rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="mt-2 bg-primary hover:bg-primary-dark text-text-main font-bold py-3 rounded-full transition-colors disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Alterar senha'}
        </button>
      </form>
    </div>
  );
}
