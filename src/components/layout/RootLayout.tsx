import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../navigation/Footer";
import Navbar from "../navigation/Navbar";

/**
 * App shell — deep near-black canvas with slow, restrained ambient light.
 * The glow layer is decorative only and drifts imperceptibly on capable
 * devices; prefers-reduced-motion freezes it.
 */
export default function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-lime-300 focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-slate-950"
      >
        Skip to content
      </a>

      {/* Ambient room lighting — blue / green / violet, kept far below neon levels */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[38rem] w-[38rem] rounded-full bg-cyan-600/[0.09] blur-[160px] motion-safe:animate-drift" />
        <div className="absolute top-1/3 -right-24 h-[34rem] w-[34rem] rounded-full bg-blue-600/[0.08] blur-[180px] motion-safe:animate-drift-alt" />
        <div className="absolute bottom-[-6rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-emerald-500/[0.05] blur-[180px] motion-safe:animate-drift" />
        <div className="absolute top-1/4 right-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-600/[0.05] blur-[170px] motion-safe:animate-drift-alt" />
        {/* Fine background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <Navbar />

      <main
        id="main-content"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 pt-2 sm:px-6 sm:pt-3 lg:px-8"
      >
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}
