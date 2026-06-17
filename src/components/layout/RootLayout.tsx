import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../navigation/Footer";
import Navbar from "../navigation/Navbar";

export default function RootLayout() {
  return (
    <div
      className="
      relative
      flex
      min-h-screen
      flex-col
      overflow-hidden
      bg-gradient-to-br
      from-slate-950
      via-indigo-950
      to-slate-900
      text-ink
    "
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Top Left Indigo Glow */}
        <div
          className="
            absolute
            left-[-12rem]
            top-[-10rem]
            h-[35rem]
            w-[35rem]
            rounded-full
            bg-indigo-600/20
            blur-[180px]
          "
        />

        {/* Top Right Blue Glow */}
        <div
          className="
            absolute
            right-[-12rem]
            top-[2rem]
            h-[32rem]
            w-[32rem]
            rounded-full
            bg-blue-500/15
            blur-[180px]
          "
        />

        {/* Bottom Glow */}
        <div
          className="
            absolute
            bottom-[-15rem]
            left-1/3
            h-[30rem]
            w-[30rem]
            rounded-full
            bg-violet-500/10
            blur-[200px]
          "
        />
      </div>





      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-gutter pb-section pt-8 sm:pt-10 lg:pt-14">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}

