'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, ArrowLeft, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Conversation {
  contact: { id: string; name: string; role: string; vendorProfile?: { businessName: string; avatar: string | null } | null };
  lastMessage: { content: string; createdAt: string } | null;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  orderRef: string | null;
  createdAt: string;
}

export function ChatInterface() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeContact, setActiveContact] = useState<Conversation['contact'] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setConversations(data ?? []);
    } catch {}
  }, []);

  const loadMessages = useCallback(async (contactId: string) => {
    try {
      const res = await fetch(`/api/messages?contactId=${contactId}`);
      const data = await res.json();
      setMessages(data ?? []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {}
  }, []);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    if (!activeContact) return;
    loadMessages(activeContact.id);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => loadMessages(activeContact.id), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeContact, loadMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeContact) return;
    setSending(true);
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: activeContact.id, content: newMsg }),
      });
      setNewMsg('');
      await loadMessages(activeContact.id);
      loadConversations();
    } catch {} finally {
      setSending(false);
    }
  };

  const formatTime = (d: string) => {
    try { return new Date(d).toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  const getDisplayName = (c: Conversation['contact']) => {
    return c?.vendorProfile?.businessName ?? c?.name ?? 'Usuario';
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] bg-card rounded-xl shadow-md overflow-hidden">
      {/* Conversation list */}
      <div className={cn(
        'w-full md:w-80 border-r flex flex-col',
        activeContact ? 'hidden md:flex' : 'flex'
      )}>
        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" />Mensajes</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(conversations?.length ?? 0) === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No tienes conversaciones aún</div>
          ) : (
            (conversations ?? []).map((conv: Conversation) => (
              <button
                key={conv?.contact?.id}
                onClick={() => setActiveContact(conv.contact)}
                className={cn(
                  'w-full text-left p-4 hover:bg-muted/50 transition-colors border-b',
                  activeContact?.id === conv?.contact?.id && 'bg-muted'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{getDisplayName(conv.contact)}</p>
                      {(conv?.unreadCount ?? 0) > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv?.lastMessage?.content ?? ''}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className={cn(
        'flex-1 flex flex-col',
        !activeContact ? 'hidden md:flex' : 'flex'
      )}>
        {activeContact ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <button className="md:hidden" onClick={() => setActiveContact(null)}><ArrowLeft className="w-5 h-5" /></button>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{getDisplayName(activeContact)}</p>
                <p className="text-xs text-muted-foreground">{activeContact?.role === 'vendedor' ? 'Vendedor' : 'Cliente'}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(messages ?? []).map((msg: Message) => {
                const isOwn = msg?.senderId === session?.user?.id;
                return (
                  <motion.div
                    key={msg?.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                  >
                    <div className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                      isOwn ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'
                    )}>
                      <p>{msg?.content}</p>
                      {msg?.orderRef && (
                        <p className="text-xs opacity-70 mt-1">📦 Ref. pedido: #{(msg.orderRef ?? '').slice(-6)}</p>
                      )}
                      <p className={cn('text-[10px] mt-1', isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                        {formatTime(msg?.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
              <Input
                placeholder="Escribe un mensaje..."
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={sending || !newMsg.trim()} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Selecciona una conversación para comenzar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
