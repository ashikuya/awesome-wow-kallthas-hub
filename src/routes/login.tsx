import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Snowfall } from "@/components/Snowfall";
import { RuneCircle } from "@/components/RuneCircle";
import { Eye, EyeOff, Loader2, Shield, Swords } from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email("Ungültige E-Mail"),
  password: z.string().min(6, "Mindestens 6 Zeichen"),
});

const registerSchema = z.object({
  email: z.string().trim().email("Ungültige E-Mail"),
  game_account: z
    .string()
    .trim()
    .min(3, "Mindestens 3 Zeichen")
    .max(16, "Maximal 16 Zeichen")
    .regex(/^[a-zA-Z0-9]+$/, "Nur Buchstaben und Zahlen"),
  password: z.string().min(8, "Mindestens 8 Zeichen").max(72),
});

export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/account",
    mode: ((search.mode as string) === "register" ? "register" : "login") as "login" | "register",
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(search.mode);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gameAccount, setGameAccount] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const parsed = loginSchema.parse({ email, password });
        const { error } = await supabase.auth.signInWithPassword(parsed);
        if (error) throw error;
        toast.success("Willkommen zurück, Champion!");
        navigate({ to: search.redirect });
      } else {
        const parsed = registerSchema.parse({ email, password, game_account: gameAccount });
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { game_account: parsed.game_account.toLowerCase() },
          },
        });
        if (error) throw error;
        toast.success("Account erstellt! Du wirst weitergeleitet…");
        navigate({ to: "/account" });
      }
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.issues[0].message : err instanceof Error ? err.message : "Fehler";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Snowfall count={40} />
      <RuneCircle className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] opacity-20" />
      <RuneCircle className="pointer-events-none absolute -right-32 bottom-1/4 h-[400px] w-[400px] opacity-15" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md border border-frost/40 bg-card/60 backdrop-blur shadow-frost-sm">
              <span className="font-display text-2xl text-frost">K</span>
            </div>
            <div>
              <div className="font-display text-2xl tracking-[0.3em] text-gradient-frost">KAEL'THAS</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Wrath of the Lich King</div>
            </div>
          </Link>

          <div className="relative overflow-hidden rounded-xl border border-frost/30 bg-card/60 p-8 backdrop-blur shadow-frost-sm">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-frost/20 blur-3xl" />

            <div className="relative">
              <div className="mb-6 grid grid-cols-2 gap-1 rounded-md border border-border bg-background/40 p-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded px-4 py-2 text-xs font-display uppercase tracking-widest transition ${
                    mode === "login" ? "bg-frost/20 text-frost shadow-frost-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Einloggen
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`rounded px-4 py-2 text-xs font-display uppercase tracking-widest transition ${
                    mode === "register" ? "bg-frost/20 text-frost shadow-frost-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Registrieren
                </button>
              </div>

              <h1 className="mb-2 font-display text-2xl text-foreground">
                {mode === "login" ? "Willkommen zurück" : "Tritt der Schlacht bei"}
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Setze deine Reise durch Azeroth fort."
                  : "Erstelle deinen Account für den Kael'thas Realm."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-frost">
                      <Swords className="h-3 w-3" /> Account Name (In-Game)
                    </label>
                    <input
                      type="text"
                      value={gameAccount}
                      onChange={(e) => setGameAccount(e.target.value)}
                      placeholder="z.B. arthasfan"
                      maxLength={16}
                      required
                      className="w-full rounded-md border border-border bg-background/60 px-4 py-3 font-mono text-sm text-foreground outline-none transition focus:border-frost focus:shadow-frost-sm"
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Dein Login-Name für den WoW-Client. 3-16 Zeichen, nur Buchstaben & Zahlen.
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-[10px] font-display uppercase tracking-widest text-frost">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="champion@azeroth.gg"
                    required
                    className="w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-frost focus:shadow-frost-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-display uppercase tracking-widest text-frost">
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-md border border-border bg-background/60 px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-frost focus:shadow-frost-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-frost"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border border-frost/60 bg-frost/15 py-3.5 font-display text-sm uppercase tracking-[0.25em] text-frost transition hover:bg-frost/25 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      {mode === "login" ? "Einloggen" : "Account erstellen"}
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Noch keinen Account?{" "}
                    <button onClick={() => setMode("register")} className="text-frost hover:underline">
                      Jetzt registrieren
                    </button>
                  </>
                ) : (
                  <>
                    Bereits registriert?{" "}
                    <button onClick={() => setMode("login")} className="text-frost hover:underline">
                      Einloggen
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          <Link to="/" className="mt-6 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-frost">
            ← zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
