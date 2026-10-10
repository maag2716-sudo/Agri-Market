'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import {
  Menu, X, ShoppingCart, MessageSquare, CalendarDays, Store,
  Package, User, LogOut, LayoutDashboard, Search
} from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user;
  const isVendor = user?.role === 'vendedor';
  const isClient = user?.role === 'cliente';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <Link href={user ? (isVendor ? '/vendedor' : '/cliente') : '/'} className="flex-shrink-0">
          <Logo size={36} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {!user && (
            <>
              <Link href="/#categorias"><Button variant="ghost" size="sm">Categorías</Button></Link>
              <Link href="/#por-que"><Button variant="ghost" size="sm">¿Por qué?</Button></Link>
              <Link href="/auth"><Button size="sm">Ingresar</Button></Link>
            </>
          )}
          {isVendor && (
            <>
              <Link href="/vendedor"><Button variant="ghost" size="sm"><LayoutDashboard className="w-4 h-4 mr-1" />Panel</Button></Link>
              <Link href="/vendedor/productos"><Button variant="ghost" size="sm"><Package className="w-4 h-4 mr-1" />Productos</Button></Link>
              <Link href="/vendedor/pedidos"><Button variant="ghost" size="sm"><Store className="w-4 h-4 mr-1" />Pedidos</Button></Link>
              <Link href="/vendedor/mensajes"><Button variant="ghost" size="sm"><MessageSquare className="w-4 h-4 mr-1" />Mensajes</Button></Link>
              <Link href="/vendedor/calendario"><Button variant="ghost" size="sm"><CalendarDays className="w-4 h-4 mr-1" />Calendario</Button></Link>
            </>
          )}
          {isClient && (
            <>
              <Link href="/cliente"><Button variant="ghost" size="sm"><LayoutDashboard className="w-4 h-4 mr-1" />Panel</Button></Link>
              <Link href="/cliente/explorar"><Button variant="ghost" size="sm"><Search className="w-4 h-4 mr-1" />Explorar</Button></Link>
              <Link href="/cliente/carrito"><Button variant="ghost" size="sm"><ShoppingCart className="w-4 h-4 mr-1" />Carrito</Button></Link>
              <Link href="/cliente/pedidos"><Button variant="ghost" size="sm"><Package className="w-4 h-4 mr-1" />Pedidos</Button></Link>
              <Link href="/cliente/mensajes"><Button variant="ghost" size="sm"><MessageSquare className="w-4 h-4 mr-1" />Mensajes</Button></Link>
              <Link href="/cliente/calendario"><Button variant="ghost" size="sm"><CalendarDays className="w-4 h-4 mr-1" />Calendario</Button></Link>
            </>
          )}
          {user && (
            <Button variant="ghost" size="sm" onClick={() => signOut({ redirectTo: '/' })}>
              <LogOut className="w-4 h-4 mr-1" />Salir
            </Button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-4 space-y-1">
          {!user && (
            <>
              <Link href="/auth" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start"><User className="w-4 h-4 mr-2" />Ingresar</Button>
              </Link>
            </>
          )}
          {isVendor && (
            <>
              <Link href="/vendedor" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><LayoutDashboard className="w-4 h-4 mr-2" />Panel</Button></Link>
              <Link href="/vendedor/productos" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><Package className="w-4 h-4 mr-2" />Productos</Button></Link>
              <Link href="/vendedor/pedidos" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><Store className="w-4 h-4 mr-2" />Pedidos</Button></Link>
              <Link href="/vendedor/mensajes" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><MessageSquare className="w-4 h-4 mr-2" />Mensajes</Button></Link>
              <Link href="/vendedor/calendario" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><CalendarDays className="w-4 h-4 mr-2" />Calendario</Button></Link>
            </>
          )}
          {isClient && (
            <>
              <Link href="/cliente" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><LayoutDashboard className="w-4 h-4 mr-2" />Panel</Button></Link>
              <Link href="/cliente/explorar" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><Search className="w-4 h-4 mr-2" />Explorar</Button></Link>
              <Link href="/cliente/carrito" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><ShoppingCart className="w-4 h-4 mr-2" />Carrito</Button></Link>
              <Link href="/cliente/pedidos" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><Package className="w-4 h-4 mr-2" />Pedidos</Button></Link>
              <Link href="/cliente/mensajes" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><MessageSquare className="w-4 h-4 mr-2" />Mensajes</Button></Link>
              <Link href="/cliente/calendario" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start"><CalendarDays className="w-4 h-4 mr-2" />Calendario</Button></Link>
            </>
          )}
          {user && (
            <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={() => { setMenuOpen(false); signOut({ redirectTo: '/' }); }}>
              <LogOut className="w-4 h-4 mr-2" />Cerrar sesión
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
