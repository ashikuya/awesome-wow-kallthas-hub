import { useState, type ReactNode } from "react";
import { Copy, Check, Download, Server, Sword, X } from "lucide-react";
import { toast } from "sonner";

const REALMLIST = "set realmlist login.kaelthas.gg";

export function ConnectDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(REALMLIST);
    setCopied(true);
    toast.success("Realmlist kopiert!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <span onClick={() => setOpen(true)} className="contents cursor-pointer">
        {trigger}
      </span>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-frost/40 bg-card/95 p-8 shadow-frost backdrop-blur"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:border-frost/60 hover:text-frost transition"
              aria-label="Schließen"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-frost/20 blur-3xl" />

            <div className="relative">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-frost">
                <Server className="h-3 w-3" /> Mit Kaelthas verbinden
              </div>
              <h2 className="font-display text-2xl text-foreground">In 3 Schritten nach Azeroth</h2>

              <ol className="mt-6 space-y-4 text-sm">
                <Step n="1" title="WoW Client 3.3.5a besorgen">
                  Jeden originalen Wrath of the Lich King Client (Build 12340).
                </Step>
                <Step n="2" title="realmlist.wtf bearbeiten">
                  Im Ordner <code className="rounded bg-background/60 px-1.5 py-0.5 text-xs font-mono text-frost">Data/deDE/</code>{" "}
                  bzw. <code className="rounded bg-background/60 px-1.5 py-0.5 text-xs font-mono text-frost">Data/enUS/</code>{" "}
                  die Datei <code className="rounded bg-background/60 px-1.5 py-0.5 text-xs font-mono text-frost">realmlist.wtf</code>{" "}
                  öffnen und ersetzen:
                  <div className="mt-3 flex items-center gap-2 rounded-md border border-frost/40 bg-background/70 px-3 py-2.5">
                    <code className="flex-1 break-all font-mono text-sm text-frost">{REALMLIST}</code>
                    <button
                      onClick={copy}
                      className="flex shrink-0 items-center gap-1.5 rounded border border-frost/60 bg-frost/10 px-3 py-1.5 text-xs font-display uppercase tracking-widest text-frost transition hover:bg-frost/20"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Kopiert" : "Kopieren"}
                    </button>
                  </div>
                </Step>
                <Step n="3" title="Wow.exe starten & einloggen">
                  Mit deinem Account-Namen und Passwort, das du auf dieser Seite registriert hast.
                </Step>
              </ol>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
                <a
                  href="https://www.mediafire.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-frost/60 bg-frost/15 px-4 py-2.5 font-display text-xs uppercase tracking-widest text-frost transition hover:bg-frost/25"
                >
                  <Download className="h-3.5 w-3.5" />
                  Client Download
                </a>
                <a
                  href="/login?mode=register"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-4 py-2.5 font-display text-xs uppercase tracking-widest text-foreground transition hover:border-frost/60 hover:text-frost"
                >
                  <Sword className="h-3.5 w-3.5" />
                  Account erstellen
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-frost/40 bg-frost/10 font-display text-sm text-frost">
        {n}
      </div>
      <div className="flex-1">
        <div className="font-display text-foreground">{title}</div>
        <div className="mt-1 text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}
