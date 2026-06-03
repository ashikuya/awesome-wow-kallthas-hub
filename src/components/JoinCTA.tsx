import { Download, MessageSquare, ChevronRight } from "lucide-react";
import { ConnectDialog } from "./ConnectDialog";

const steps = [
  { n: "01", title: "Account erstellen", text: "Registriere dich in 30 Sekunden — kostenlos und ohne E-Mail-Bestätigung." },
  { n: "02", title: "Client herunterladen", text: "Lade unseren vorkonfigurierten 3.3.5a Client herunter (12 GB)." },
  { n: "03", title: "Realmlist setzen", text: "Trage unsere Realmlist ein und logge dich in Azeroth ein." },
];

export function JoinCTA() {
  return (
    <section id="join" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-frost/40 p-12 sm:p-16">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-card)" }} />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-frost/20 blur-3xl" />
          <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-frost">In 3 Schritten</p>
              <h2 className="font-display text-4xl sm:text-5xl text-gradient-frost leading-tight">
                Werde Teil der Legende
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Tausende Spieler haben den Weg nach Azeroth bereits gefunden. Heute ist dein Tag, dich der Schlacht gegen den Lich King anzuschließen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ConnectDialog
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md border border-frost/60 bg-frost/15 px-6 py-3 font-display text-sm uppercase tracking-widest text-frost backdrop-blur transition hover:bg-frost/25"
                    >
                      <Download className="h-4 w-4" />
                      Jetzt verbinden
                    </button>
                  }
                />
                <a
                  href="https://discord.gg/kaelthas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-6 py-3 font-display text-sm uppercase tracking-widest text-foreground transition hover:border-frost/50 hover:text-frost"
                >
                  <MessageSquare className="h-4 w-4" />
                  Discord
                </a>
              </div>
            </div>

            <ol className="space-y-4">
              {steps.map((s) => (
                <li
                  key={s.n}
                  className="group relative flex gap-5 rounded-lg border border-border bg-background/40 p-6 backdrop-blur transition hover:border-frost/40"
                >
                  <div className="font-display text-4xl text-frost/40 group-hover:text-frost transition">{s.n}</div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground self-center group-hover:text-frost group-hover:translate-x-1 transition" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
