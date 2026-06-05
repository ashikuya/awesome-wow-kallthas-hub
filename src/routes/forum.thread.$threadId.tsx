import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Snowfall } from "@/components/Snowfall";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { ArrowLeft, Lock, Pin, Send, Shield, Sword } from "lucide-react";

interface Thread {
  id: string; board_id: string; title: string; author_id: string;
  sticky: boolean; locked: boolean; created_at: string;
}
interface Board { id: string; name: string }
interface Post { id: string; thread_id: string; author_id: string; body: string; created_at: string; edited_at: string | null }
interface MiniProfile {
  id: string; game_account: string; display_name: string | null;
  faction: string; avatar_url: string | null; created_at: string;
}

export const Route = createFileRoute("/forum/thread/$threadId")({
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const { isAuthenticated, user } = useAuth();
  const [thread, setThread] = useState<Thread | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, MiniProfile>>({});
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const loadPosts = async () => {
    const { data: p } = await supabase
      .from("forum_posts").select("*").eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    const list = (p as Post[]) ?? [];
    setPosts(list);
    if (list.length) {
      const ids = Array.from(new Set(list.map((x) => x.author_id)));
      const { data: pr } = await supabase
        .from("profiles").select("id, game_account, display_name, faction, avatar_url, created_at")
        .in("id", ids);
      const pm: Record<string, MiniProfile> = {};
      ((pr as MiniProfile[]) ?? []).forEach((r) => (pm[r.id] = r));
      setProfiles(pm);
    }
  };

  useEffect(() => {
    (async () => {
      const { data: t } = await supabase.from("forum_threads").select("*").eq("id", threadId).maybeSingle();
      const tr = t as Thread | null;
      setThread(tr);
      if (tr) {
        const { data: b } = await supabase.from("forum_boards").select("id, name").eq("id", tr.board_id).maybeSingle();
        setBoard(b as Board | null);
      }
      await loadPosts();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const submitReply = async () => {
    if (!user || !thread || thread.locked) return;
    if (reply.trim().length < 2) {
      toast.error("Bitte schreib mindestens ein paar Zeichen.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("forum_posts").insert({
      thread_id: threadId, author_id: user.id, body: reply.trim(),
    });
    setSending(false);
    if (error) {
      toast.error("Antwort konnte nicht gepostet werden.");
      return;
    }
    setReply("");
    toast.success("Antwort gepostet!");
    await loadPosts();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Snowfall count={25} />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pb-20 pt-32">
        <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/forum" className="text-frost hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Forum
          </Link>
          {board && (
            <>
              <span className="text-frost/40">/</span>
              <Link to="/forum/board/$boardId" params={{ boardId: board.id }} className="text-frost hover:underline">
                {board.name}
              </Link>
            </>
          )}
        </div>

        <div className="mb-6 flex items-center gap-3">
          {thread?.locked && <Lock className="h-5 w-5 text-destructive" />}
          {thread?.sticky && <Pin className="h-5 w-5 text-gold" />}
          <h1 className="font-display text-2xl sm:text-3xl text-gradient-frost">{thread?.title ?? "…"}</h1>
        </div>

        <div className="space-y-4">
          {posts.map((p, idx) => {
            const a = profiles[p.author_id];
            const isHorde = a?.faction === "horde";
            return (
              <article
                key={p.id}
                className="overflow-hidden rounded-lg border border-frost/30 bg-card/50 backdrop-blur shadow-frost-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
                  {/* Author column — WBB3 style */}
                  <div className="border-b sm:border-b-0 sm:border-r border-frost/20 bg-gradient-to-b from-frost/10 to-transparent p-4 text-center">
                    <div className="font-display text-frost truncate">{a?.display_name || a?.game_account || "User"}</div>
                    <div className={`mt-2 inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-display uppercase tracking-widest ${
                      isHorde ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-frost/40 bg-frost/10 text-frost"
                    }`}>
                      {isHorde ? <Sword className="h-2.5 w-2.5" /> : <Shield className="h-2.5 w-2.5" />}
                      {isHorde ? "Horde" : "Allianz"}
                    </div>
                    {a?.created_at && (
                      <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                        Dabei seit<br/>{new Date(a.created_at).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>

                  {/* Post body */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between border-b border-border/50 px-5 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>#{idx + 1}</span>
                      <span>{new Date(p.created_at).toLocaleString("de-DE")}</span>
                    </div>
                    <div className="flex-1 whitespace-pre-wrap break-words px-5 py-4 text-sm leading-relaxed text-foreground">
                      {p.body}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {posts.length === 0 && (
            <div className="rounded-lg border border-border bg-card/40 px-5 py-10 text-center text-sm text-muted-foreground">
              Keine Beiträge gefunden.
            </div>
          )}
        </div>

        {/* Reply box */}
        <div className="mt-8">
          {thread?.locked ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-5 py-4 text-center text-sm text-destructive">
              <Lock className="inline h-4 w-4 mr-2" /> Dieses Thema ist gesperrt.
            </div>
          ) : isAuthenticated ? (
            <div className="rounded-lg border border-frost/40 bg-card/60 p-5 backdrop-blur">
              <div className="mb-2 text-xs uppercase tracking-widest text-frost">Antworten</div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Deine Antwort…"
                rows={5}
                maxLength={5000}
                className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm font-mono focus:border-frost/60 focus:outline-none resize-y"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={submitReply}
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-md border border-frost/60 bg-frost/15 px-4 py-2 font-display text-xs uppercase tracking-widest text-frost transition hover:bg-frost/25 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" /> {sending ? "Sende…" : "Posten"}
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              search={{ redirect: `/forum/thread/${threadId}`, mode: "login" }}
              className="block rounded-md border border-frost/40 bg-card/60 px-5 py-4 text-center text-sm text-frost hover:bg-frost/10 transition"
            >
              Einloggen um zu antworten →
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
