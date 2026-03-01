import { useState, useEffect } from 'react';
import { SiteSettings, SITE_DEFAULTS } from '../types/content';

export function useSiteContent() {
  const [settings, setSettings] = useState<SiteSettings>(SITE_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setSettings({ ...SITE_DEFAULTS, ...data } as SiteSettings);
      })
      .catch(() => {
        // API indisponível: usa defaults silenciosamente
      })
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const clean = number.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
