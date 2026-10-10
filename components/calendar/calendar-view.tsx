'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, X, Check, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CalEvent {
  id: string;
  proposerId: string;
  participantId: string;
  title: string;
  description: string | null;
  proposedDate: string;
  status: string;
  orderId: string | null;
  proposer: { id: string; name: string };
  participant: { id: string; name: string };
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const STATUS_COLORS: Record<string, string> = {
  propuesto: 'bg-yellow-500',
  confirmado: 'bg-green-500',
  rechazado: 'bg-red-500',
};

export function CalendarView() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(() => {
    // SSR-safe: use a fixed epoch, then update in useEffect
    return new Date(2026, 8, 1);
  });

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ participantId: '', title: '', description: '', proposedDate: '' });
  const [contacts, setContacts] = useState<any[]>([]);

  const loadEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      setEvents(data ?? []);
    } catch {}
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setContacts((data ?? []).map((c: any) => c?.contact).filter(Boolean));
    } catch {}
  }, []);

  useEffect(() => { loadEvents(); loadContacts(); }, [loadEvents, loadContacts]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const getEventsForDay = (day: number) => {
    return (events ?? []).filter((e: CalEvent) => {
      const d = new Date(e?.proposedDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Evento propuesto');
        setShowForm(false);
        setForm({ participantId: '', title: '', description: '', proposedDate: '' });
        loadEvents();
      }
    } catch { toast.error('Error'); }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/calendar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { toast.success('Estado actualizado'); loadEvents(); }
  };

  const pendingCount = (events ?? []).filter((e: CalEvent) => e?.status === 'propuesto' && e?.participantId === session?.user?.id).length;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" /> Calendario
          {pendingCount > 0 && (
            <span className="bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
              {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </h1>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" />Proponer Fecha</Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <form onSubmit={handleCreate} className="bg-card rounded-xl p-6 shadow-md space-y-4">
              <div className="flex justify-between"><h2 className="font-semibold">Proponer Entrega</h2><button type="button" onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button></div>
              <div>
                <Label>Participante</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm mt-1" value={form.participantId} onChange={e => setForm({ ...form, participantId: e.target.value })} required>
                  <option value="">Seleccionar...</option>
                  {(contacts ?? []).map((c: any) => <option key={c?.id} value={c?.id}>{c?.vendorProfile?.businessName ?? c?.name}</option>)}
                </select>
              </div>
              <div><Label>Título</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1" required placeholder="Ej: Entrega de pedido" /></div>
              <div><Label>Fecha y hora propuesta</Label><Input type="datetime-local" value={form.proposedDate} onChange={e => setForm({ ...form, proposedDate: e.target.value })} className="mt-1" required /></div>
              <div><Label>Descripción (opcional)</Label><textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <Button type="submit">Proponer</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar grid */}
      <div className="bg-card rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))}><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="font-semibold text-lg">{MONTHS[month]} {year}</h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))}><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>)}
          {days.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            return (
              <button
                key={`day-${day}`}
                onClick={() => setSelectedDate(new Date(year, month, day))}
                className={cn(
                  'aspect-square rounded-lg p-1 text-sm relative hover:bg-muted/50 transition-colors',
                  isToday && 'ring-2 ring-primary',
                  selectedDate?.getDate() === day && selectedDate?.getMonth() === month && 'bg-primary/10'
                )}
              >
                <span className="block text-center">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 justify-center mt-0.5">
                    {dayEvents.slice(0, 3).map((ev: CalEvent) => (
                      <div key={ev?.id} className={cn('w-1.5 h-1.5 rounded-full', STATUS_COLORS[ev?.status] ?? 'bg-gray-400')} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events for selected date */}
      {selectedDate && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">
            Eventos del {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
          </h3>
          {getEventsForDay(selectedDate.getDate()).length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin eventos este día</p>
          ) : (
            getEventsForDay(selectedDate.getDate()).map((ev: CalEvent) => (
              <div key={ev?.id} className="bg-card rounded-lg p-4 shadow-sm border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{ev?.title}</p>
                    <p className="text-xs text-muted-foreground">Propuesto por: {ev?.proposer?.name}</p>
                    <p className="text-xs text-muted-foreground">Para: {ev?.participant?.name}</p>
                    {ev?.description && <p className="text-sm mt-1">{ev.description}</p>}
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full text-white', STATUS_COLORS[ev?.status] ?? 'bg-gray-400')}>
                    {ev?.status}
                  </span>
                </div>
                {ev?.status === 'propuesto' && ev?.participantId === session?.user?.id && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => updateStatus(ev.id, 'confirmado')}><Check className="w-3 h-3 mr-1" />Confirmar</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(ev.id, 'rechazado')}><XCircle className="w-3 h-3 mr-1" />Rechazar</Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
