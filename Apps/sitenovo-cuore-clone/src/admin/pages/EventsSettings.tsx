import { useState, useEffect, useCallback } from 'react';
import { useAdminSettings } from '../useAdminSettings';
import { FormPage, Field, TextareaField, Feedback } from '../components/FormComponents';
import { Plus, Pencil, Trash2, X, Check, Calendar } from 'lucide-react';
import { CuoreEvent } from '../../types/content';

// ─── Formulário de evento ──────────────────────────────────────────────────────

interface EventFormProps {
  initial?: Partial<CuoreEvent>;
  onSave: (data: Omit<CuoreEvent, 'id'>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function EventForm({ initial = {}, onSave, onCancel, saving }: EventFormProps) {
  const [name, setName] = useState(initial.name ?? '');
  const [date, setDate] = useState(initial.date ?? '');
  const [time, setTime] = useState(initial.time ?? '');
  const [location, setLocation] = useState(initial.location ?? '');
  const [city, setCity] = useState(initial.city ?? '');
  const [isFree, setIsFree] = useState(initial.is_free !== undefined ? Boolean(initial.is_free) : true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave({ name, date, time, location, city, is_free: isFree ? 1 : 0 });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-background-light border border-primary/20 rounded-2xl p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            Nome do evento <span className="text-red-400">*</span>
          </label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Feira Orgânica BH"
            className="w-full rounded-xl border border-[#d4dece] bg-white px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            Data <span className="text-red-400">*</span>
          </label>
          <input
            required
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded-xl border border-[#d4dece] bg-white px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Horário</label>
          <input
            value={time}
            onChange={e => setTime(e.target.value)}
            placeholder="Ex: 9h às 18h"
            className="w-full rounded-xl border border-[#d4dece] bg-white px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Local / Espaço</label>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Ex: Parque Expo BH"
            className="w-full rounded-xl border border-[#d4dece] bg-white px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Cidade</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Ex: Belo Horizonte - MG"
            className="w-full rounded-xl border border-[#d4dece] bg-white px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>
      {/* Toggle gratuito/pago */}
      <div className="md:col-span-2 flex items-center gap-4 pt-1">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Tipo de acesso:</span>
        <div className="flex rounded-xl border border-[#d4dece] overflow-hidden text-sm">
          <button
            type="button"
            onClick={() => setIsFree(true)}
            className={`px-4 py-2 font-medium transition-colors ${isFree ? 'bg-primary text-text-main' : 'bg-white text-text-secondary hover:bg-background-light'}`}
          >
            Gratuito
          </button>
          <button
            type="button"
            onClick={() => setIsFree(false)}
            className={`px-4 py-2 font-medium transition-colors ${!isFree ? 'bg-amber-500 text-white' : 'bg-white text-text-secondary hover:bg-background-light'}`}
          >
            Pago
          </button>
        </div>
        <span className="text-xs text-text-secondary">
          {isFree ? 'Aparece tag "Evento Gratuito" no site' : 'Aparece botão "Garantir minha vaga" → WhatsApp'}
        </span>
      </div>

      <div className="flex gap-3 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d4dece] text-sm text-text-secondary hover:bg-white transition-colors"
        >
          <X size={15} /> Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-text-main text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Check size={15} /> {saving ? 'Salvando...' : 'Salvar evento'}
        </button>
      </div>
    </form>
  );
}

// ─── Card de evento na lista ───────────────────────────────────────────────────

interface EventCardProps {
  event: CuoreEvent & { active?: number };
  onEdit: () => void;
  onDelete: () => void;
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const [year, month, day] = event.date.split('-');
  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const monthName = monthNames[parseInt(month, 10) - 1] ?? month;

  return (
    <div className="flex items-center gap-4 bg-white border border-[#e0e6db] rounded-2xl px-5 py-4">
      <div className="flex-shrink-0 w-12 text-center">
        <div className="text-2xl font-display font-black text-primary leading-none">{day}</div>
        <div className="text-[11px] text-text-secondary uppercase tracking-wider">{monthName}</div>
        <div className="text-[10px] text-text-secondary/50">{year}</div>
      </div>
      <div className="w-px self-stretch bg-[#e0e6db] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-text-main font-semibold text-sm truncate">{event.name}</p>
          {event.is_free
            ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">Gratuito</span>
            : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pago</span>
          }
        </div>
        <p className="text-text-secondary text-xs mt-0.5 truncate">
          {[event.location, event.city, event.time].filter(Boolean).join(' · ')}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-[#e0e6db] hover:border-primary hover:text-primary bg-white transition-colors"
        >
          <Pencil size={13} /> Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500 border border-red-100 hover:bg-red-50 bg-white transition-colors"
        >
          <Trash2 size={13} /> Excluir
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────

const SECTION_KEYS = ['eventos.title', 'eventos.subtitle'];

export default function EventsSettings() {
  const { values, set, loading: settingsLoading, saving: settingsSaving, save, feedback } = useAdminSettings(SECTION_KEYS);
  const [events, setEvents] = useState<(CuoreEvent & { active?: number })[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<(CuoreEvent & { active?: number }) | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [eventFeedback, setEventFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const token = localStorage.getItem('cuore_admin_token') ?? '';

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const r = await fetch('/api/events/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, [token]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  async function handleCreate(data: Omit<CuoreEvent, 'id'>) {
    setFormSaving(true);
    try {
      const r = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error();
      setShowForm(false);
      setEventFeedback({ type: 'ok', msg: 'Evento adicionado!' });
      await loadEvents();
    } catch {
      setEventFeedback({ type: 'err', msg: 'Erro ao salvar o evento.' });
    } finally {
      setFormSaving(false);
    }
  }

  async function handleUpdate(data: Omit<CuoreEvent, 'id'>) {
    if (!editingEvent) return;
    setFormSaving(true);
    try {
      const r = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error();
      setEditingEvent(null);
      setEventFeedback({ type: 'ok', msg: 'Evento atualizado!' });
      await loadEvents();
    } catch {
      setEventFeedback({ type: 'err', msg: 'Erro ao atualizar o evento.' });
    } finally {
      setFormSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Excluir este evento?')) return;
    try {
      await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventFeedback({ type: 'ok', msg: 'Evento excluído.' });
      await loadEvents();
    } catch {
      setEventFeedback({ type: 'err', msg: 'Erro ao excluir o evento.' });
    }
  }

  if (settingsLoading) return <div className="p-8 text-text-secondary">Carregando...</div>;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto flex flex-col gap-10">

      {/* Seção: textos da seção */}
      <FormPage
        title="Agenda de Eventos"
        desc="Configure o título e subtítulo da seção de eventos no site."
        onSave={save}
        saving={settingsSaving}
      >
        <Feedback feedback={feedback} />
        <Field
          label="Título da seção"
          value={values['eventos.title']}
          onChange={v => set('eventos.title', v)}
        />
        <TextareaField
          label="Subtítulo / chamada"
          value={values['eventos.subtitle']}
          onChange={v => set('eventos.subtitle', v)}
          rows={2}
        />
      </FormPage>

      {/* Seção: lista de eventos */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-main font-bold text-lg flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Eventos cadastrados
            </h2>
            <p className="text-text-secondary text-sm mt-0.5">
              Adicione, edite ou remova eventos da programação.
            </p>
          </div>
          {!showForm && !editingEvent && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-text-main text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> Adicionar evento
            </button>
          )}
        </div>

        {/* Feedback de eventos */}
        {eventFeedback && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between ${
            eventFeedback.type === 'ok'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {eventFeedback.msg}
            <button onClick={() => setEventFeedback(null)} className="ml-3 opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Formulário de criação */}
        {showForm && (
          <EventForm
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
            saving={formSaving}
          />
        )}

        {/* Lista */}
        {loadingEvents ? (
          <p className="text-text-secondary text-sm py-4">Carregando eventos...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#d4dece] rounded-2xl">
            <Calendar size={36} className="text-text-secondary/40 mx-auto mb-3" />
            <p className="text-text-secondary text-sm">Nenhum evento cadastrado ainda.</p>
            <p className="text-text-secondary/60 text-xs mt-1">Clique em "Adicionar evento" para começar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {events.map(event =>
              editingEvent?.id === event.id ? (
                <EventForm
                  key={event.id}
                  initial={event}
                  onSave={handleUpdate}
                  onCancel={() => setEditingEvent(null)}
                  saving={formSaving}
                />
              ) : (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => { setShowForm(false); setEditingEvent(event); }}
                  onDelete={() => handleDelete(event.id)}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
