import { Logo } from './logo';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="mx-auto max-w-[1200px] px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo size={28} />
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Leaf className="w-4 h-4 text-primary" />
          Del campo a tu mesa — El Salvador
        </p>
        <p className="text-xs text-muted-foreground">
          © 2026 Agri Market. Universidad Dr. José Matías Delgado.
        </p>
      </div>
    </footer>
  );
}
