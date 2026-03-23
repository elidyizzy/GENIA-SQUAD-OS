import React, { useRef, useState } from 'react';
import { Save, Upload, X } from 'lucide-react';

// ─── Feedback ─────────────────────────────────────────────────────────────────

interface FeedbackProps {
  feedback: { type: 'success' | 'error'; msg: string } | null;
}
export function Feedback({ feedback }: FeedbackProps) {
  if (!feedback) return null;
  return (
    <div className={`text-sm rounded-lg px-4 py-3 border ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
      {feedback.msg}
    </div>
  );
}

// ─── FormPage ─────────────────────────────────────────────────────────────────

interface FormPageProps {
  title: string;
  desc: string;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}
export function FormPage({ title, desc, onSave, saving, children }: FormPageProps) {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-black text-text-main">{title}</h1>
        <p className="text-text-secondary mt-1">{desc}</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#e0e6db] p-6 flex flex-col gap-5">
        {children}
        <div className="pt-2 border-t border-[#e0e6db]">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-text-main font-bold px-6 py-3 rounded-full transition-colors disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SectionDivider ───────────────────────────────────────────────────────────

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">{label}</span>
      <div className="flex-1 h-px bg-[#e0e6db]" />
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}
export function Field({ label, value, onChange, placeholder, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-main">{label}</label>
      {hint && <p className="text-xs text-text-secondary">{hint}</p>}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-[#e0e6db] rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}

// ─── TextareaField ────────────────────────────────────────────────────────────

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}
export function TextareaField({ label, value, onChange, rows = 3, hint }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-main">{label}</label>
      {hint && <p className="text-xs text-text-secondary">{hint}</p>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="border border-[#e0e6db] rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors resize-none"
      />
    </div>
  );
}

// ─── ImageField ───────────────────────────────────────────────────────────────

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}
export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const token = localStorage.getItem('cuore_admin_token');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar imagem');
      onChange(data.url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-main">{label}</label>

      {/* Área de preview / upload */}
      <div className="relative rounded-xl border-2 border-dashed border-[#e0e6db] hover:border-primary/50 transition-colors overflow-hidden bg-background-light">
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-52 object-cover"
              onError={e => (e.currentTarget.style.opacity = '0.3')}
            />
            {/* Overlay com botão trocar */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-white text-text-main text-sm font-bold px-4 py-2 rounded-full hover:bg-primary transition-colors"
              >
                <Upload size={16} />
                {uploading ? 'Enviando...' : 'Trocar imagem'}
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="flex items-center justify-center size-9 bg-white/90 text-red-500 rounded-full hover:bg-red-50 transition-colors"
                title="Remover imagem"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full h-36 flex flex-col items-center justify-center gap-3 text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <Upload size={28} className={uploading ? 'animate-bounce' : ''} />
            <span className="text-sm font-medium">
              {uploading ? 'Enviando imagem...' : 'Clique para subir uma imagem'}
            </span>
            <span className="text-xs text-text-secondary/60">JPG, PNG, WebP ou GIF · máx. 10 MB</span>
          </button>
        )}
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}

      {/* Campo URL manual (opcional) */}
      <details className="mt-1">
        <summary className="text-xs text-text-secondary cursor-pointer hover:text-primary transition-colors select-none">
          Ou cole uma URL de imagem
        </summary>
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full border border-[#e0e6db] rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
        />
      </details>
    </div>
  );
}
