import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-lichking.jpg";
import { RuneCircle } from "./RuneCircle";
import { ConnectDialog } from "./ConnectDialog";
import { ChevronRight, Users, Server, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Status {
  online: boolean;
  players_online: number;
  uptime_seconds: number;
}

export function Hero() {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    supabase
      .from("realm_status")
      .select("online, players_online, uptime_seconds")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setStatus(data as Status | null));
  }, []);

  const uptimePct = "99.9%";
  const players = status?.players_online ?? 1247;

  return (
    <section id="home" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="The Lich King upon the Frozen Throne"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      <RuneCircle className="absolute right-[8%] top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 opacity-40 lg:block" />
      <RuneCircle className="absolute left-[-10%] bottom-[-10%] h-[360px] w-[360px] opacity-20 lg:opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-frost/40 bg-card/40 px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-frost opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-frost" />
            </span>
            <span className="text-xs uppercase tracking-[0.3em] text-frost">
              Realm Online · {players.toLocaleString()} Players
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-7xl lg:text-8xl">
            <span className="text-gradient-frost block">KAELTHAS</span>
            <span className="mt-2 block text-2xl font-normal tracking-[0.3em] text-muted-foreground sm:text-4xl sm:tracking-[0.4em]">
              FROZEN LEGACY
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Erlebe World of Warcraft <span className="text-frost">Wrath of the Lich King</span> wie damals — Patch 3.3.5a,
            blizzlike scripting, Icecrown Citadel auf Pre-Nerf Werten. Powered by AzerothCore.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              search={isAuthenticated ? undefined : { redirect: "/account", mode: "register" }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-md border border-frost/60 bg-frost/10 px-6 sm:px-8 py-4 text-sm font-display uppercase tracking-[0.25em] text-frost backdrop-blur transition-all hover:bg-frost/20 animate-pulse-frost"
            >
              <span className="relative z-10">{isAuthenticated ? "Mein Account" : "Jetzt Beitreten"}</span>
              <ChevronRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-1" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-frost/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <a
              href="#realm"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/40 px-6 sm:px-8 py-4 text-sm font-display uppercase tracking-[0.25em] text-foreground backdrop-blur transition hover:border-frost/60 hover:text-frost"
            >
              Verbinden
            </a>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-frost/20 bg-frost/20 backdrop-blur">
            {[
              { icon: Users, label: "Online", value: players.toLocaleString() },
              { icon: Server, label: "Uptime", value: uptimePct },
              { icon: Zap, label: "Rates", value: "x1–x10" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-card/80 px-3 sm:px-6 py-5">
                <s.icon className="h-5 w-5 text-frost shrink-0" />
                <div className="min-w-0">
                  <div className="font-display text-lg sm:text-2xl text-foreground truncate">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
