import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Home, CheckSquare, Newspaper, LogIn, User, Menu, X, LogOut, MessagesSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const items = [
  { label: "Home", icon: Home, href: "/" },
  { label: "News", icon: Newspaper, href: "/news" },
  { label: "Forum", icon: MessagesSquare, href: "/forum" },
  { label: "Vote", icon: CheckSquare, href: "/account/vote", auth: true },
  { label: "Armory", icon: Shield, href: "/account" },
];

export function Navbar() {
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md border border-frost/40 bg-card/60 backdrop-blur shadow-frost-sm">
            <span className="font-display text-frost text-lg">K</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-xl tracking-widest text-gradient-frost">KAELTHAS</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">WotLK · 3.3.5a</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-lg border border-frost/20 bg-card/40 px-2 py-1.5 backdrop-blur-md">
          {items.map((it) => (
            <Link
              key={it.label}
              to={it.href}
              className="group flex items-center gap-2 rounded-md px-4 py-2 text-sm uppercase tracking-wider text-muted-foreground transition-all hover:bg-frost/10 hover:text-frost"
              activeProps={{ className: "text-frost bg-frost/10" }}
            >
              <it.icon className="h-4 w-4" />
              <span className="font-display">{it.label}</span>
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="hidden sm:flex items-center gap-2 rounded-md border border-frost/40 bg-card/60 px-3 py-2 text-sm text-frost backdrop-blur transition hover:bg-frost/10"
              >
                <User className="h-4 w-4" />
                <span className="font-mono text-xs">{profile?.game_account ?? "Account"}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Abmelden"
                className="hidden sm:grid h-9 w-9 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground transition hover:border-destructive/60 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              search={{ redirect: "/account", mode: "login" }}
              className="flex items-center gap-2 rounded-md border border-frost/40 bg-card/60 px-3 py-2 sm:px-4 text-sm uppercase tracking-wider text-frost backdrop-blur transition hover:bg-frost/10"
            >
              <LogIn className="h-4 w-4" />
              <span className="font-display hidden sm:inline">Log in</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden grid h-9 w-9 place-items-center rounded-md border border-frost/40 bg-card/60 text-frost"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-frost/20 bg-card/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {items.map((it) => (
              <Link
                key={it.label}
                to={it.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-4 py-3 text-sm uppercase tracking-wider text-muted-foreground transition hover:bg-frost/10 hover:text-frost"
              >
                <it.icon className="h-4 w-4" />
                <span className="font-display">{it.label}</span>
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm uppercase tracking-wider text-muted-foreground transition hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-display">Abmelden</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
