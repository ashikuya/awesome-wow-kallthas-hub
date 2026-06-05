import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Snowfall } from "@/components/Snowfall";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { ChevronRight, Pin, Lock, Plus, MessageSquare, ArrowLeft } from "lucide-react";

interface Board { id: string; name: string; description: string }
interface Thread {
  id: string; title: string; author_id: string; sticky: boolean;
  locked: boolean; view_count: number; created_at: string; last_post_at: string;
}
interface ThreadStat { thread_id: string; post_count: number; last_post_user_id: string | null }
interface MiniProfile { id: string; game_account: string; display_name: string | null; faction: string }

export const Route = createFileRoute("/forum/board/$boardId")({
  component: BoardPage,
});

function BoardPage() {
  const { boardId } = Route.useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [stats, setStats] = useState<Record<string, ThreadStat>>({});
  const [profiles, setProfiles] = useState<Record<string, MiniProfile>>({});
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: b } = await supabase.from("forum_boards").select("id, name, description").eq("id", boardId).maybeSingle();
      setBoard(b as Board | null);
      const { data: t } = await supabase
        .from("forum_threads").select("*").eq("board_id", boardId)
        .order("sticky", { ascending: false }).order("last_post_at", { ascending: false });
      const tlist = (t as Thread[]) ?? [];
      setThreads(tlist);

      if (tlist.length) {
        const ids = tlist.map((x) => x.id);
        const [s, p] = await Promise.all([
          supabase.from("forum_thread_stats").select("*").in("thread_id", ids),
          supabase.from("profiles").select("id, game_account, display_name, faction").in("id", tlist.map((x) => x.author_id)),
        ]);
        const sm: Record<string, ThreadStat> = {};
        ((s.data as ThreadStat[]) ?? []).forEach((r) => (sm[r.thread_id] = r));
        setStats(sm);
        const pm: Record<string, MiniProfile> = {};
        ((p.data as MiniProfile[]) ?? []).forEach((r) => (pm[r.id] = r));
        setProfiles(pm);
      }
    })();
  }, [boardId]);

  const createThread = async () => {
    if (!user) return;
    if (title.trim().length < 3 || body.trim().length < 3) {
      toast.error("Titel und Inhalt brauchen mindestens 3 Zeichen.");
      return;
    }
    setSaving(true);
    const { data: thread, error } = await supabase
      .from("forum_threads")
      .insert({ board_id: boardId, author_id: user.id, title: title.trim() })
      .select("id").single();
    if (error || !thread) {
      toast.error("Konnte Thema nicht erstellen.");
      setSaving(false);
      return;
    }
    const { error: pErr } = await supabase
      .from("forum_posts")
      .insert({ thread_id: thread.id, author_id: user.id, body: body.trim() });
    setSaving(false);
    if (pErr) {
      toast.error("Beitrag konnte nicht gespeichert werden.");
      return;
    }
    toast.success("Thema erstellt!");
    navigate({ to: "/forum/thread/$threadId", params: { threadId: thread.id } });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Snowfall count={25} />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-20 pt-32">
        <Link to="/forum" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-frost hover:underline mb-6">
          <ArrowLeft className="h-3 w-3" /> Zurück zum Forum
        </Link>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-gradient-frost">{board?.name ?? "…"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{board?.description}</p>
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => setShowNew((s) => !s)}
              className="inline-flex items-center gap-2 rounded-md border border-frost/60 bg-frost/15 px-4 py-2 font-display text-xs uppercase tracking-widest text-frost transition hover:bg-frost/25"
            >
              <Plus className="h-4 w-4" /> Neues Thema
            </button>
          ) : (
            <Link
              to="/login"
              search={{ redirect: `/forum/board/${boardId}`, mode: "login" }}
              className="text-xs uppercase tracking-widest text-frost hover:underline"
            >
              Einloggen zum Posten →
            </Link>
          )}
        </div>

        {showNew && isAuthenticated && (
          <div className="mb-6 rounded-lg border border-frost/40 bg-card/60 p-5 backdrop-blur">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel des Themas"
              maxLength={200}
              className="mb-3 w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm focus:border-frost/60 focus:outline-none"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Schreib was dich bewegt…"
              rows={5}
              maxLength={5000}
              className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm font-mono focus:border-frost/60 focus:outline-none resize-y"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setShowNew(false)} className="rounded-md border border-border bg-card/60 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition">
                Abbrechen
              </button>
              <button
                onClick={createThread}
                disabled={saving}
                className="rounded-md border border-frost/60 bg-frost/15 px-4 py-2 font-display text-xs uppercase tracking-widest text-frost transition hover:bg-frost/25 disabled:opacity-50"
              >
                {saving ? "…" : "Thema posten"}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-frost/30 bg-card/40 backdrop-blur">
          <div className="hidden sm:grid grid-cols-[1fr_100px_180px] gap-4 border-b border-frost/30 bg-gradient-to-r from-frost/30 via-frost/10 to-transparent px-5 py-2 font-display text-[10px] uppercase tracking-widest text-frost">
            <span>Thema</span>
            <span className="text-center">Antworten</span>
            <span className="text-right">Letzter Beitrag</span>
          </div>
          <ul className="divide-y divide-border">
            {threads.map((t) => {
              const st = stats[t.id];
              const author = profiles[t.author_id];
              return (
                <li key={t.id}>
                  <Link
                    to="/forum/thread/$threadId"
                    params={{ threadId: t.id }}
                    className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_100px_180px] items-center gap-4 px-5 py-3 transition hover:bg-frost/5"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-md border border-frost/30 bg-frost/5 text-frost/70 shrink-0">
                      {t.locked ? <Lock className="h-4 w-4" /> : t.sticky ? <Pin className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {t.sticky && <span className="rounded border border-gold/40 bg-gold/10 px-1.5 py-0.5 text-[9px] font-display uppercase tracking-widest text-gold">Sticky</span>}
                        <span className="font-display text-foreground group-hover:text-frost transition line-clamp-1">{t.title}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        von <span className="text-frost/80">{author?.display_name || author?.game_account || "User"}</span>
                        {" · "}{new Date(t.created_at).toLocaleDateString("de-DE")}
                      </div>
                    </div>
                    <div className="hidden sm:block text-center text-sm">
                      <div className="font-display text-frost">{Math.max(0, (st?.post_count ?? 1) - 1)}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Antworten</div>
                    </div>
                    <div className="hidden sm:flex items-center justify-end gap-2 text-xs text-muted-foreground">
                      <span>{new Date(t.last_post_at).toLocaleString("de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      <ChevronRight className="h-4 w-4 text-frost/60 group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                </li>
              );
            })}
            {threads.length === 0 && (
              <li className="px-5 py-12 text-center text-sm text-muted-foreground">
                Noch keine Themen — sei der Erste!
              </li>
            )}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
