import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Copy, Server, Download, Sparkles, Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/account/")({
  component: AccountOverview,
});

const REALMLIST = "set realmlist login.kaelthas.gg";

function AccountOverview() {
  const { profile, user } = useAuth();

  const copyRealmlist = () => {
    navigator.clipboard.writeText(REALMLIST);
    toast.success("Realmlist kopiert!");
  };

  return (
    <div className="space-y-6">
      {/* Connect card */}
      <section className="relative overflow-hidden rounded-xl border border-frost/40 bg-card/60 p-8 backdrop-blur">
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-frost/20 blur-3xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-frost">
            <Server className="h-3 w-3" /> Mit dem Realm verbinden
          </div>
          <h2 className="font-display text-2xl text-foreground">Dein Tor nach Azeroth</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Öffne deinen 3.3.5a WoW-Client → bearbeite <code className="rounded bg-background/60 px-1.5 py-0.5 text-xs">realmlist.wtf</code> im
            Data-Ordner und füge ein:
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-md border border-frost/40 bg-background/70 px-4 py-3">
            <code className="flex-1 break-all font-mono text-sm text-frost">{REALMLIST}</code>
            <button
              onClick={copyRealmlist}
              className="flex items-center gap-2 rounded border border-frost/60 bg-frost/10 px-3 py-1.5 text-xs font-display uppercase tracking-widest text-frost transition hover:bg-frost/20"
            >
              <Copy className="h-3 w-3" /> Kopieren
            </button>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-md border border-border bg-background/40 p-4">
              <div className="text-[10px] uppercase tracking-widest text-frost">Account Name</div>
              <div className="mt-1 font-mono text-foreground">{profile?.game_account}</div>
            </div>
            <div className="rounded-md border border-border bg-background/40 p-4">
              <div className="text-[10px] uppercase tracking-widest text-frost">Passwort</div>
              <div className="mt-1 text-foreground">— wie bei der Registrierung —</div>
            </div>
          </div>
        </div>
      </section>

      {/* Account info */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-frost">
            <Crown className="h-3 w-3" /> Account
          </div>
          <dl className="space-y-2 text-sm">
            <Row k="E-Mail" v={user?.email ?? "—"} />
            <Row k="Account Name" v={profile?.game_account ?? "—"} />
            <Row k="Display Name" v={profile?.display_name ?? "—"} />
            <Row k="Erstellt" v={user?.created_at ? new Date(user.created_at).toLocaleDateString("de-DE") : "—"} />
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-frost">
            <Sparkles className="h-3 w-3" /> Belohnungen
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-frost/20 bg-background/40 p-3">
              <span className="text-sm text-muted-foreground">Vote Points</span>
              <span className="font-display text-xl text-frost">{profile?.vote_points ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-frost/20 bg-background/40 p-3">
              <span className="text-sm text-muted-foreground">Donor Coins</span>
              <span className="font-display text-xl text-gold">{profile?.donor_coins ?? 0}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-8 backdrop-blur">
        <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-frost">
              <Download className="h-3 w-3" /> WoW Client 3.3.5a (12340)
            </div>
            <h3 className="font-display text-xl text-foreground">Brauchst du den Client?</h3>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Wir bieten einen vorkonfigurierten 3.3.5a Client mit korrekter Realmlist (~12 GB).
              Alternativ kannst du jeden originalen WotLK-Client verwenden.
            </p>
          </div>
          <a
            href="https://www.mediafire.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-frost/60 bg-frost/15 px-6 py-3 font-display text-sm uppercase tracking-widest text-frost transition hover:bg-frost/25"
          >
            <Download className="h-4 w-4" /> Download
          </a>
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right text-foreground">{v}</dd>
    </div>
  );
}
