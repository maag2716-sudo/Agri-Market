'use client';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Basket body */}
        <path d="M12 30 L16 52 L48 52 L52 30 Z" fill="#dda15e" stroke="#bc6c25" strokeWidth="2" />
        {/* Basket weave lines */}
        <line x1="20" y1="30" x2="22" y2="52" stroke="#bc6c25" strokeWidth="1.2" />
        <line x1="32" y1="30" x2="32" y2="52" stroke="#bc6c25" strokeWidth="1.2" />
        <line x1="44" y1="30" x2="42" y2="52" stroke="#bc6c25" strokeWidth="1.2" />
        <line x1="13" y1="38" x2="51" y2="38" stroke="#bc6c25" strokeWidth="1.2" />
        <line x1="14" y1="45" x2="50" y2="45" stroke="#bc6c25" strokeWidth="1.2" />
        {/* Basket handle */}
        <path d="M18 30 Q32 10 46 30" fill="none" stroke="#bc6c25" strokeWidth="2.5" strokeLinecap="round" />
        {/* Tomato */}
        <circle cx="24" cy="26" r="7" fill="#e76f51" />
        <path d="M22 20 Q24 18 26 20" fill="#40916c" />
        {/* Carrot */}
        <path d="M38 18 L41 30 L35 30 Z" fill="#f4a261" />
        <line x1="37" y1="21" x2="35" y2="16" stroke="#40916c" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="38" y1="19" x2="38" y2="13" stroke="#40916c" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="39" y1="20" x2="41" y2="15" stroke="#40916c" strokeWidth="1.5" strokeLinecap="round" />
        {/* Lettuce leaf */}
        <path d="M28 22 Q18 12 22 8 Q28 14 32 10 Q30 18 28 22" fill="#52b788" />
      </svg>
      <span className="font-display font-bold text-lg tracking-tight text-primary">
        Agri <span className="text-accent">Market</span>
      </span>
    </div>
  );
}
