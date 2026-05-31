const phases = [
  { phase: "Phase I", name: "Naxxramas", status: "Cleared", desc: "Naxx · OS · EoE · VoA" },
  { phase: "Phase II", name: "Ulduar", status: "Cleared", desc: "Yogg+0 verfügbar" },
  { phase: "Phase III", name: "Trial of the Crusader", status: "Active", desc: "10/25 N & HC" },
  { phase: "Phase IV", name: "Icecrown Citadel", status: "Soon", desc: "Coming Q3 2026" },
  { phase: "Phase V", name: "Ruby Sanctum", status: "Locked", desc: "Halion erwacht" },
];

export function Progression() {
  return (
    <section className="relative py-32" id="progression">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-frost">Content Progression</p>
          <h2 className="font-display text-4xl sm:text-5xl text-gradient-frost">Der Weg zum Lich King</h2>
          <div className="runic-divider mx-auto mt-6 w-48" />
        </div>

        <div className="mt-20 relative">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-frost/40 to-transparent lg:block" />
          <div className="grid gap-6 lg:grid-cols-5">
            {phases.map((p) => {
              const isActive = p.status === "Active";
              const isLocked = p.status === "Locked" || p.status === "Soon";
              return (
                <div
                  key={p.phase}
                  className={`relative rounded-lg border p-6 backdrop-blur transition-all ${
                    isActive
                      ? "border-frost bg-frost/10 shadow-frost-sm"
                      : isLocked
                        ? "border-border bg-card/30 opacity-60"
                        : "border-border bg-card/50"
                  }`}
                >
                  <div className="absolute -top-3 left-6 rounded bg-background px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {p.phase}
                  </div>
                  <div className="mt-2">
                    <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-frost/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-frost animate-pulse" : "bg-muted-foreground"}`} />
                      <span className={isActive ? "text-frost" : "text-muted-foreground"}>{p.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
