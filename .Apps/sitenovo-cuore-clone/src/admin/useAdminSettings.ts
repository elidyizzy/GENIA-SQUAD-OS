import { useState, useEffect } from 'react';

export function useAdminSettings(keys: string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        const filtered: Record<string, string> = {};
        for (const k of keys) filtered[k] = data[k] ?? '';
        setValues(filtered);
      })
      .catch(() => setFeedback({ type: 'error', msg: 'Erro ao carregar configurações' }))
      .finally(() => setLoading(false));
  }, []);

  function set(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setFeedback(null);
    const token = localStorage.getItem('cuore_admin_token');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setFeedback({ type: 'success', msg: 'Salvo com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ type: 'error', msg: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  }

  return { values, set, loading, saving, save, feedback };
}
