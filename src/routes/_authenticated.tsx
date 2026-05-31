import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    // While auth is still hydrating on first paint, isLoading is true — don't redirect yet.
    if (context.auth && !context.auth.isLoading && !context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href, mode: "login" },
      });
    }
  },
  component: () => <Outlet />,
});
