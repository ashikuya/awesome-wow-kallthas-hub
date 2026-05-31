import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Vote, ExternalLink, Clock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account/vote")({
  component: VotePage,
});

const sites = [
  { id: "wow-top", name: "WoW Top 100", url: "https://www.gtop100.com", points: 1 },
  { id: "xtremetop", name: "XtremeTop 100", url: "https://www.xtremetop100.com", points: 1 },
  { id: "topg", name: "TopG Servers", url: "https://topg.org", points: 1 },
  { id: "arena-top", name: "Arena Top 100", url: "https://www.arena-top100.com", points: 2 },
];

interface VoteRow {
  site: string;
  voted_at: string;
}

function VotePage() {
  const { user, refreshProfile, profile } = useAuth();
  const [recent, setRecent] = useState<VoteRow[]>([]);
  const [loadingSite, setLoadingSite] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("vote_logs")
      .select("site, voted_at")
      .eq("user_id", user.id)
      .order("voted_at", { ascending: false })
      .limit(20);
    setRecent((data as VoteRow[]) ?? []);
  };

  useEffect(() => { load(); }, [user?.id]);

  const cooldownFor = (siteId: string) => {
    const last = recent.find((r) => r.site === siteId);
    if (!last) return 0;
    const elapsed = Date.now() - new Date(last.voted_at).getTime();
    const cd = 12 * 60 * 60 * 1000 - elapsed;
    return cd > 0 ? cd : 0;
  };

  const handleVote = async (site: typeof sites[number]) => {
    if (!user) return;
    setLoadingSite(site.id);
    try {
      // Open vote site
      window.open(site.url, "_blank", "noopener");
      // Log vote (server trigger enforces 12h cooldown + awards points)
      const { error } = await supabase
        .from("vote_logs")
        .insert({ user_id: user.id, site: site.id, points_awarded: site.points });
      if (error) throw error;
      toast.success(`+${site.points} Vote Points! Danke für deinen Vote.`);
      await load();
      await refreshProfile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoadingSite(null);
    }
  };

  const fmt = (ms: number) => {
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-frost/30 bg-card/50 p-8 backdrop-blur">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-frost">
              <Vote className="h-3 w-3" /> Vote Center
            </div>
            <h2 className="font-display text-2xl text-foreground">Hilf uns wachsen</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Voten alle 12 Stunden auf jeder Seite und verdiene Vote Points.
            </p>
          </div>
          <div className="rounded-lg border border-frost/40 bg-frost/10 px-6 py-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-frost">Deine Punkte</div>
            <div className="font-display text-3xl text-gradient-frost">{profile?.vote_points ?? 0}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {sites.map((s) => {
          const cd = cooldownFor(s.id);
          const ready = cd === 0;
          return (
            <div
              key={s.id}
              className="group flex items-center justify-between rounded-lg border border-border bg-card/40 p-5 backdrop-blur transition hover:border-frost/40"
            >
              <div>
                <div className="font-display text-foreground">{s.name}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-frost" /> +{s.points} Points
                </div>
              </div>
              <button
                disabled={!ready || loadingSite === s.id}
                onClick={() => handleVote(s)}
                className="inline-flex items-center gap-2 rounded-md border border-frost/60 bg-frost/15 px-4 py-2 text-xs font-display uppercase tracking-widest text-frost transition hover:bg-frost/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ready ? (
                  <>
                    Voten <ExternalLink className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3" /> {fmt(cd)}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </section>

      {recent.length > 0 && (
        <section className="rounded-xl border border-border bg-card/40 p-6 backdrop-blur">
          <h3 className="mb-4 font-display text-sm uppercase tracking-widest text-frost">Letzte Votes</h3>
          <ul className="space-y-2">
            {recent.slice(0, 10).map((r, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{sites.find((s) => s.id === r.site)?.name ?? r.site}</span>
                <span className="text-muted-foreground">{new Date(r.voted_at).toLocaleString("de-DE")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
