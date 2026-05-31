import { Crown, Swords, Sparkles, Shield, Coins, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Crown,
    title: "Blizzlike 3.3.5a",
    text: "Authentisches Wrath-Erlebnis. Original Talente, Quests und Bossmechaniken — keine Custom-Klassen, keine Pay-to-Win.",
  },
  {
    icon: Swords,
    title: "Icecrown Citadel",
    text: "ICC 10/25 normal & heroic auf Pre-Nerf 5%-Buff Werten. Lich King wartet auf dich.",
  },
  {
    icon: Sparkles,
    title: "Progressive Content",
    text: "Naxxramas → Ulduar → ToC → ICC im klassischen Release-Rhythmus. Erlebe Wrath wie 2010.",
  },
  {
    icon: Shield,
    title: "Stable & Secure",
    text: "Dedizierte Hardware, DDoS-Protection, tägliche Backups und ein engagiertes GM-Team.",
  },
  {
    icon: Coins,
    title: "Faire Rates",
    text: "x1 – x10 XP konfigurierbar pro Charakter. x3 Professions, x10 Reputation für entspanntes Leveln.",
  },
  {
    icon: HeartHandshake,
    title: "Aktive Community",
    text: "Deutsche & englische Spieler, aktiver Discord, regelmäßige PvP- und Raid-Events.",
  },
];

export function Features() {
  return (
    <section className="relative py-32" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-frost">Warum Kael'thas</p>
          <h2 className="font-display text-4xl sm:text-5xl text-gradient-frost">Das Königreich erwartet dich</h2>
          <div className="runic-divider mx-auto mt-6 w-48" />
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-8 backdrop-blur transition-all hover:border-frost/50 hover:shadow-frost-sm"
              style={{ animation: `fade-up 0.6s ease-out ${i * 0.08}s both` }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-frost/10 blur-3xl transition-opacity group-hover:bg-frost/20" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md border border-frost/40 bg-frost/10">
                  <f.icon className="h-6 w-6 text-frost" />
                </div>
                <h3 className="mb-3 font-display text-xl text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
