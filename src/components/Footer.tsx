export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="font-display text-2xl tracking-[0.3em] text-gradient-frost">KAEL'THAS</div>
          <div className="runic-divider w-64" />
          <p className="max-w-xl text-xs text-muted-foreground leading-relaxed">
            Kael'thas ist ein nicht-kommerzielles Fan-Projekt und steht in keinerlei Verbindung zu Blizzard Entertainment. World of Warcraft® und Wrath of the Lich King® sind eingetragene Marken von Blizzard Entertainment, Inc.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <a href="#" className="hover:text-frost transition">Impressum</a>
            <span className="text-frost/30">·</span>
            <a href="#" className="hover:text-frost transition">Datenschutz</a>
            <span className="text-frost/30">·</span>
            <a href="#" className="hover:text-frost transition">Regeln</a>
            <span className="text-frost/30">·</span>
            <a href="#" className="hover:text-frost transition">Status</a>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            © 2026 Kael'thas Realm · Powered by AzerothCore
          </p>
        </div>
      </div>
    </footer>
  );
}
