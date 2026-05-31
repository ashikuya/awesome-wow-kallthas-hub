import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Calendar, Tag } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
}

const categoryStyles: Record<string, string> = {
  announcement: "text-frost border-frost/40 bg-frost/10",
  patch: "text-gold border-gold/40 bg-gold/10",
  event: "text-foreground border-accent/50 bg-accent/20",
};

export function News() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase
      .from("news")
      .select("id, title, excerpt, category, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setItems((data as NewsItem[]) ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative py-32" id="news">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.4em] text-frost">Aktuelles aus Northrend</p>
            <h2 className="font-display text-4xl sm:text-5xl text-gradient-frost">News & Patchnotes</h2>
          </div>
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-frost hover:underline"
          >
            <Newspaper className="h-3 w-3" /> Alle News
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((n, i) => (
            <article
              key={n.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 backdrop-blur transition-all hover:border-frost/40 hover:shadow-frost-sm"
              style={{ animation: `fade-up 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-frost/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3 text-xs">
                  <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-display uppercase tracking-widest ${categoryStyles[n.category] ?? "border-border text-muted-foreground"}`}>
                    <Tag className="h-2.5 w-2.5" />
                    {n.category}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(n.created_at).toLocaleDateString("de-DE")}
                  </span>
                </div>
                <h3 className="font-display text-lg text-foreground leading-snug">{n.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
