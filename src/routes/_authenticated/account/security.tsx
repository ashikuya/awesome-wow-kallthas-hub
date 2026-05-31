import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account/security")({
  component: SecurityPage,
});

const passSchema = z.object({
  password: z.string().min(8, "Mindestens 8 Zeichen").max(72),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirm"],
});

function SecurityPage() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsed = passSchema.parse({ password: pw, confirm });
      const { error } = await supabase.auth.updateUser({ password: parsed.password });
      if (error) throw error;
      toast.success("Passwort aktualisiert!");
      setPw("");
      setConfirm("");
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.issues[0].message : err instanceof Error ? err.message : "Fehler";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card/50 p-8 backdrop-blur">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-frost">
          <Lock className="h-3 w-3" /> Passwort ändern
        </div>
        <h2 className="font-display text-2xl text-foreground">Sicherheit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Wähle ein starkes Passwort, mindestens 8 Zeichen. Wird auch für den In-Game Login verwendet.
        </p>

        <form onSubmit={handle} className="mt-6 space-y-4 max-w-md">
          <div>
            <label className="mb-1.5 block text-[10px] font-display uppercase tracking-widest text-frost">
              Neues Passwort
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-frost focus:shadow-frost-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-display uppercase tracking-widest text-frost">
              Bestätigen
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-frost focus:shadow-frost-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md border border-frost/60 bg-frost/15 px-6 py-3 font-display text-sm uppercase tracking-widest text-frost transition hover:bg-frost/25 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Passwort aktualisieren
          </button>
        </form>
      </section>
    </div>
  );
}
