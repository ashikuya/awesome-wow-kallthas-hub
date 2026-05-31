import { Link } from "@tanstack/react-router";
import { Shield, Home, CheckSquare, HelpCircle, MessageSquare, LogIn } from "lucide-react";

const items = [
  { label: "Home", icon: Home, href: "#home" },
  { label: "Armory", icon: Shield, href: "#armory" },
  { label: "Vote", icon: CheckSquare, href: "#vote" },
  { label: "Support", icon: HelpCircle, href: "#support" },
  { label: "Discord", icon: MessageSquare, href: "#discord" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative grid h-10 w-10 place-items-center rounded-md border border-frost/40 bg-card/60 backdrop-blur shadow-frost-sm">
            <span className="font-display text-frost text-lg">K</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-xl tracking-widest text-gradient-frost">KAEL'THAS</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Wrath of the Lich King · 3.3.5a</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-lg border border-frost/20 bg-card/40 px-2 py-1.5 backdrop-blur-md">
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              className="group flex items-center gap-2 rounded-md px-4 py-2 text-sm uppercase tracking-wider text-muted-foreground transition-all hover:bg-frost/10 hover:text-frost"
            >
              <it.icon className="h-4 w-4" />
              <span className="font-display">{it.label}</span>
            </a>
          ))}
        </nav>

        <a
          href="#login"
          className="flex items-center gap-2 rounded-md border border-frost/40 bg-card/60 px-4 py-2 text-sm uppercase tracking-wider text-frost backdrop-blur transition hover:bg-frost/10 hover:shadow-frost-sm"
        >
          <LogIn className="h-4 w-4" />
          <span className="font-display">Log in</span>
        </a>
      </div>
    </header>
  );
}
