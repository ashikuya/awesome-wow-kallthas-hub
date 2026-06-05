import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="font-display text-2xl tracking-[0.3em] text-gradient-frost">KAELTHAS</div>
          <div className="runic-divider w-64" />
          <p className="max-w-xl text-xs text-muted-foreground leading-relaxed">
            Kaelthas ist ein nicht-kommerzielles Fan-Projekt und steht in keinerlei Verbindung zu Blizzard Entertainment. World of Warcraft® und Wrath of the Lich King® sind eingetragene Marken von Blizzard Entertainment, Inc.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <Link to="/news" className="hover:text-frost transition">News</Link>
            <span className="text-frost/30">·</span>
            <Link to="/forum" className="hover:text-frost transition">Forum</Link>
            <span className="text-frost/30">·</span>
            <a href="https://discord.gg/kaelthas" target="_blank" rel="noopener noreferrer" className="hover:text-frost transition">Discord</a>
            <span className="text-frost/30">·</span>
            <a href="mailto:contact@kaelthas.gg" className="hover:text-frost transition">Kontakt</a>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            © 2026 Kaelthas Realm · Powered by AzerothCore
          </p>
        </div>
      </div>
    </footer>
  );
}
