import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouteContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider, useAuth, type AuthState } from "../hooks/use-auth";
import { supabase } from "../integrations/supabase/client";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-gradient-frost">404</h1>
        <h2 className="mt-4 font-display text-xl text-foreground">Pfad verloren im Schneesturm</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Diese Seite existiert nicht — oder die Geister von Northrend haben sie verschluckt.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-frost/60 bg-frost/10 px-6 py-3 text-sm font-display uppercase tracking-widest text-frost transition hover:bg-frost/20"
          >
            Zur Festung zurück
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl text-foreground">Etwas ist schiefgelaufen</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message || "Unbekannter Fehler."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md border border-frost/60 bg-frost/10 px-4 py-2 text-sm font-display uppercase tracking-wider text-frost transition hover:bg-frost/20"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card/40 px-4 py-2 text-sm font-display uppercase tracking-wider text-foreground transition hover:border-frost/50"
          >
            Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kael'thas · WoW WotLK 3.3.5a Realm" },
      { name: "description", content: "Kael'thas — blizzlike Wrath of the Lich King Server auf AzerothCore." },
      { name: "author", content: "Kael'thas Realm" },
      { property: "og:title", content: "Kael'thas · WoW WotLK 3.3.5a Realm" },
      { property: "og:description", content: "Blizzlike Wrath of the Lich King Server auf AzerothCore." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RouterContextSync() {
  const auth = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Inject live auth state into the router's context so beforeLoad guards see it.
  useEffect(() => {
    router.update({ context: { queryClient, auth } });
    router.invalidate();
  }, [auth.isAuthenticated, auth.isLoading, auth.user?.id, router, queryClient, auth]);

  // Invalidate React Query cache on sign-in/out
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  return <Outlet />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterContextSync />
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
