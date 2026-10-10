'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CATEGORIES } from '@/lib/categories';
import { LogIn, UserPlus, Store, Mail, Lock, User, Phone, MapPin, FileText, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'login' | 'cliente' | 'vendedor';

export function AuthForms() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams?.get('tab') as Tab) || 'login';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Client signup
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Vendor signup
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPassword, setVendorPassword] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [specialty, setSpecialty] = useState('Mercado General');
  const [location, setLocation] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (result?.error) {
        toast.error('Credenciales incorrectas');
      } else {
        toast.success('¡Bienvenido!');
        window.location.href = '/';
      }
    } catch {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent, role: 'cliente' | 'vendedor') => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = role === 'cliente'
        ? { name: clientName, email: clientEmail, password: clientPassword, phone: clientPhone, role: 'cliente' }
        : { name: vendorName, email: vendorEmail, password: vendorPassword, phone: vendorPhone, role: 'vendedor', businessName, description, specialty, location };

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || 'Error al registrarse');
        return;
      }

      // Auto login
      const email = role === 'cliente' ? clientEmail : vendorEmail;
      const password = role === 'cliente' ? clientPassword : vendorPassword;
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        toast.error('Cuenta creada. Por favor inicia sesión.');
        setTab('login');
      } else {
        toast.success('¡Cuenta creada exitosamente!');
        window.location.href = role === 'vendedor' ? '/vendedor' : '/cliente';
      }
    } catch {
      toast.error('Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'login', label: 'Ingresar', icon: <LogIn className="w-4 h-4" /> },
    { key: 'cliente', label: 'Registrarse como Cliente', icon: <UserPlus className="w-4 h-4" /> },
    { key: 'vendedor', label: 'Registrarse como Vendedor', icon: <Store className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Tab buttons */}
      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              tab === t.key ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.key === 'login' ? 'Ingresar' : t.key === 'cliente' ? 'Cliente' : 'Vendedor'}</span>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8">
        {/* Login */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">Iniciar Sesión</h2>
            <p className="text-sm text-muted-foreground">Ingresa con tu cuenta de Agri Market</p>
            <div>
              <Label>Correo electrónico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="tu@correo.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>Contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" loading={loading}>Ingresar</Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <button type="button" className="text-primary hover:underline font-medium" onClick={() => setTab('cliente')}>Regístrate aquí</button>
            </p>
          </form>
        )}

        {/* Client Signup */}
        {tab === 'cliente' && (
          <form onSubmit={e => handleSignup(e, 'cliente')} className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">Registro de Comprador</h2>
            <p className="text-sm text-muted-foreground">Crea tu cuenta para comprar productos frescos</p>
            <div>
              <Label>Nombre completo</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="María Pérez" value={clientName} onChange={e => setClientName(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>Correo electrónico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="tu@correo.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>Contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="Mínimo 6 caracteres" value={clientPassword} onChange={e => setClientPassword(e.target.value)} className="pl-10" required minLength={6} />
              </div>
            </div>
            <div>
              <Label>Teléfono (opcional)</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="7000-0000" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Button type="submit" className="w-full" loading={loading}>Crear Cuenta de Comprador</Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <button type="button" className="text-primary hover:underline font-medium" onClick={() => setTab('login')}>Inicia sesión</button>
            </p>
          </form>
        )}

        {/* Vendor Signup */}
        {tab === 'vendedor' && (
          <form onSubmit={e => handleSignup(e, 'vendedor')} className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">Registro de Vendedor</h2>
            <p className="text-sm text-muted-foreground">Crea tu tienda y empieza a vender productos del campo</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Nombre completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Juan López" value={vendorName} onChange={e => setVendorName(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div>
                <Label>Nombre del negocio</Label>
                <div className="relative mt-1">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Finca El Paraíso" value={businessName} onChange={e => setBusinessName(e.target.value)} className="pl-10" required />
                </div>
              </div>
            </div>
            <div>
              <Label>Correo electrónico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="tu@correo.com" value={vendorEmail} onChange={e => setVendorEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>Contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="Mínimo 6 caracteres" value={vendorPassword} onChange={e => setVendorPassword(e.target.value)} className="pl-10" required minLength={6} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Teléfono</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="7000-0000" value={vendorPhone} onChange={e => setVendorPhone(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div>
                <Label>Ubicación / Zona</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Santa Ana, El Salvador" value={location} onChange={e => setLocation(e.target.value)} className="pl-10" />
                </div>
              </div>
            </div>
            <div>
              <Label>Especialidad</Label>
              <div className="relative mt-1">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label>Descripción del negocio</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Cuéntanos sobre tu negocio..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>Crear Cuenta de Vendedor</Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <button type="button" className="text-primary hover:underline font-medium" onClick={() => setTab('login')}>Inicia sesión</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
