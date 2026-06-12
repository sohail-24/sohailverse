import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../navigation/Footer";
import Navbar from "../navigation/Navbar";

export default function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-atmosphere text-ink">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-7rem] h-[24rem] w-[24rem] rounded-full bg-accent-soft/70 blur-3xl" />
        <div className="absolute right-[-9rem] top-[7rem] h-[26rem] w-[26rem] rounded-full bg-sky-100/80 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-teal-100/70 blur-3xl" />
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

