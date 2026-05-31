import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { User, Lock, Vote, LogOut, Shield, Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountLayout,
});

const navItems = [
  { to: "/account", label: "Übersicht", icon: User, exact: true },
  { to: "/account/security", label: "Sicherheit", icon: Lock, exact: false },
  { to: "/account/vote", label: "Voten", icon: Vote, exact: false },
];

function AccountLayout() {
  const { profile, user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Bis bald, Champion!");
    navigate({ to: "/" });
  };

  if (isLoading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-frost" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Snowfall count={30} />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-32">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-frost">User Control Panel</p>
          <h1 className="mt-2 font-display text-4xl text-gradient-frost">
            {profile?.display_name || profile?.game_account || "Champion"}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-frost" />
              <span className="font-mono">{profile?.game_account}</span>
            </span>
            <span className="text-frost/30">·</span>
            <span className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-frost" />
              {profile?.vote_points ?? 0} Vote Points
            </span>
            <span className="text-frost/30">·</span>
            <span className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-gold" />
              {profile?.donor_coins ?? 0} Coins
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-1">
            <nav className="rounded-lg border border-border bg-card/40 p-2 backdrop-blur">
              {navItems.map((item) => {
                const active = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm transition ${
                      active
                        ? "bg-frost/15 text-frost shadow-frost-sm"
                        : "text-muted-foreground hover:bg-frost/5 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-display uppercase tracking-wider">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="mt-2 flex w-full items-center gap-3 rounded-md border-t border-border px-4 py-3 pt-4 text-sm text-muted-foreground transition hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-display uppercase tracking-wider">Abmelden</span>
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
