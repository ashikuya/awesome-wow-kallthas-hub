import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Snowfall } from "@/components/Snowfall";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  MessageSquare, Megaphone, Scroll, Sword, Shield, Sparkles,
  Users, Coffee, MessagesSquare, ChevronRight,
} from "lucide-react";

const iconMap: Record<string, typeof MessageSquare> = {
  "message-square": MessageSquare,
  megaphone: Megaphone,
  scroll: Scroll,
  sword: Sword,
  shield: Shield,
  sparkles: Sparkles,
  users: Users,
  coffee: Coffee,
};

interface Category { id: string; name: string; sort_order: number }
interface Board {
  id: string; category_id: string; name: string; description: string;
  icon: string; sort_order: number;
}
interface BoardStat { board_id: string; thread_count: number; post_count: number; last_post_at: string | null }

export const Route = createFileRoute("/forum/")({
  head: () => ({
    meta: [
      { title: "Forum · Kaelthas Realm" },
      { name: "description", content: "Das Kaelthas Community-Forum — diskutiere über Raids, PvP, Klassen und mehr." },
    ],
  }),
  component: ForumIndex,
});

function ForumIndex() {
  const [cats, setCats] = useState<Category[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [stats, setStats] = useState<Record<string, BoardStat>>({});

  useEffect(() => {
    (async () => {
      const [c, b, s] = await Promise.all([
        supabase.from("forum_categories").select("*").order("sort_order"),
        supabase.from("forum_boards").select("*").order("sort_order"),
        supabase.from("forum_board_stats").select("*"),
      ]);
      setCats((c.data as Category[]) ?? []);
      setBoards((b.data as Board[]) ?? []);
      const map: Record<string, BoardStat> = {};
      ((s.data as BoardStat[]) ?? []).forEach((r) => (map[r.board_id] = r));
      setStats(map);
    })();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Snowfall count={30} />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-20 pt-32">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-frost">Realm Community</p>
          <h1 className="mt-2 font-display text-5xl text-gradient-frost flex items-center gap-3">
            <MessagesSquare className="h-10 w-10 text-frost" />
            Forum
          </h1>
          <div className="runic-divider mt-6 max-w-md" />
        </div>

        <div className="space-y-8">
          {cats.map((cat) => {
            const cb = boards.filter((b) => b.category_id === cat.id);
            return (
              <div key={cat.id} className="overflow-hidden rounded-lg border border-frost/30 bg-card/40 backdrop-blur shadow-frost-sm">
                {/* Category header — WBB3-style bar */}
                <div className="relative border-b border-frost/30 bg-gradient-to-r from-frost/30 via-frost/10 to-transparent px-5 py-3">
                  <h2 className="font-display text-sm uppercase tracking-[0.3em] text-frost">{cat.name}</h2>
                </div>

                {/* Board rows */}
                <ul className="divide-y divide-border">
                  {cb.map((b) => {
                    const Icon = iconMap[b.icon] ?? MessageSquare;
                    const st = stats[b.id];
                    return (
                      <li key={b.id}>
                        <Link
                          to="/forum/board/$boardId"
                          params={{ boardId: b.id }}
                          className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_120px_180px] items-center gap-4 px-5 py-4 transition hover:bg-frost/5"
                        >
                          <div className="grid h-12 w-12 place-items-center rounded-md border border-frost/40 bg-frost/10 text-frost shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-display text-foreground group-hover:text-frost transition">{b.name}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{b.description}</div>
                          </div>
                          <div className="hidden sm:block text-center text-xs">
                            <div className="font-display text-lg text-frost">{st?.thread_count ?? 0}</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Themen</div>
                            <div className="mt-1 text-[10px] text-muted-foreground/70">{st?.post_count ?? 0} Beiträge</div>
                          </div>
                          <div className="hidden sm:flex items-center justify-end gap-2 text-xs text-muted-foreground">
                            {st?.last_post_at ? (
                              <span>{new Date(st.last_post_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}</span>
                            ) : (
                              <span className="italic">Keine Beiträge</span>
                            )}
                            <ChevronRight className="h-4 w-4 text-frost/60 group-hover:translate-x-1 transition" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {cats.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">Forum wird geladen…</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
