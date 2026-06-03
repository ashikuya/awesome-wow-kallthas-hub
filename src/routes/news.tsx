import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Snowfall } from "@/components/Snowfall";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Tag, Newspaper } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  body: string | null;
  category: string;
  created_at: string;
}

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Patchnotes · Kaelthas Realm" },
      { name: "description", content: "Aktuelle Ankündigungen, Patchnotes und Events vom Kaelthas WotLK 3.3.5a Realm." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as NewsItem[]) ?? []));
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Snowfall count={40} />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-32">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-frost">Realm Chronik</p>
          <h1 className="mt-2 font-display text-5xl text-gradient-frost flex items-center gap-3">
            <Newspaper className="h-10 w-10 text-frost" />
            News
          </h1>
          <div className="runic-divider mt-6 max-w-md" />
        </div>

        <div className="space-y-6">
          {items.map((n) => (
            <article
              key={n.id}
              className="group rounded-xl border border-border bg-card/50 p-8 backdrop-blur transition hover:border-frost/40"
            >
              <div className="mb-4 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 rounded border border-frost/40 bg-frost/10 px-2 py-0.5 font-display uppercase tracking-widest text-frost">
                  <Tag className="h-2.5 w-2.5" /> {n.category}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(n.created_at).toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <h2 className="font-display text-2xl text-foreground">{n.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{n.excerpt}</p>
              {n.body && <div className="mt-4 text-sm text-muted-foreground/80 leading-relaxed whitespace-pre-line">{n.body}</div>}
            </article>
          ))}

          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              Noch keine News verfügbar.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
