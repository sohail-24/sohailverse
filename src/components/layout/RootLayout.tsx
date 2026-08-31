import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../navigation/Footer";
import Navbar from "../navigation/Navbar";

export default function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background glow & atmospheric star lighting */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[40rem] w-[40rem] rounded-full bg-cyan-600/10 blur-[160px]" />
        <div className="absolute top-1/3 -right-20 h-[35rem] w-[35rem] rounded-full bg-blue-600/10 blur-[180px]" />
        <div className="absolute bottom-10 left-1/3 h-[30rem] w-[30rem] rounded-full bg-emerald-600/8 blur-[180px]" />
        {/* Fine background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8 pb-16 pt-2 sm:pt-4">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}

