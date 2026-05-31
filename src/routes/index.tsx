import { createFileRoute } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Realm } from "@/components/Realm";
import { Progression } from "@/components/Progression";
import { JoinCTA } from "@/components/JoinCTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kael'thas · WoW WotLK 3.3.5a AzerothCore Realm" },
      {
        name: "description",
        content:
          "Kael'thas — blizzlike Wrath of the Lich King 3.3.5a Server auf AzerothCore. Icecrown Citadel, faire Rates, aktive Community. Jetzt beitreten.",
      },
      { property: "og:title", content: "Kael'thas · WoW WotLK 3.3.5a Realm" },
      { property: "og:description", content: "Blizzlike Wrath of the Lich King Server. AzerothCore. Tritt dem Kampf gegen den Lich King bei." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Snowfall />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Realm />
        <Progression />
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
