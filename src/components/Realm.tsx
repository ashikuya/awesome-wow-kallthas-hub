import icecrown from "@/assets/icecrown.jpg";
import frostmourne from "@/assets/frostmourne.jpg";

export function Realm() {
  return (
    <section className="relative py-32 overflow-hidden" id="realm">
      {/* Frostmourne sidekick */}
      <img
        src={frostmourne}
        alt=""
        width={1024}
        height={1280}
        loading="lazy"
        className="pointer-events-none absolute -right-20 top-10 hidden h-[700px] w-auto opacity-30 lg:block animate-float-slow"
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl border border-frost/30 shadow-frost">
            <img src={icecrown} alt="Icecrown Citadel" width={1600} height={900} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-md border border-frost/40 bg-background/70 px-4 py-3 backdrop-blur">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Realm</div>
                <div className="font-display text-foreground">Kael'thas · PvE/PvP</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-frost animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-frost">Online</span>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-frost">Server Details</p>
            <h2 className="font-display text-4xl sm:text-5xl text-gradient-frost leading-tight">
              Ein Königreich aus Eis & Stahl
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Kael'thas läuft auf AzerothCore mit handgepflegten Patches. Wir kombinieren blizzlike Authentizität mit Quality-of-Life Features die das moderne Spielen angenehmer machen — ohne den Geist von Wrath zu verraten.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-frost/20 bg-frost/20">
              {[
                ["Version", "3.3.5a · Build 12340"],
                ["Core", "AzerothCore"],
                ["Realmlist", "set realmlist kaelthas.gg"],
                ["Max Level", "80"],
                ["Fraktion", "Allianz & Horde"],
                ["Crossfaction", "Battlegrounds"],
              ].map(([k, v]) => (
                <div key={k} className="bg-card/80 px-5 py-4">
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                  <dd className="mt-1 font-display text-sm text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 rounded-lg border border-frost/30 bg-card/60 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.3em] text-frost mb-3">Verbinde dich</div>
              <code className="block break-all rounded bg-background/60 px-4 py-3 font-mono text-sm text-foreground">
                set realmlist login.kaelthas.gg
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
