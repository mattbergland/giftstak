"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BasketGeneratorForm from "@/components/BasketGeneratorForm";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="w-full px-6 py-5 flex items-center justify-between">
        <h1 className="font-serif text-xl text-warmgray-800 tracking-tight">
          Giftstak
        </h1>
        <nav className="hidden sm:flex gap-6 text-sm text-warmgray-400">
          <a href="#how" className="hover:text-warmgray-600 transition-colors">
            How It Works
          </a>
          <a href="#form" className="hover:text-warmgray-600 transition-colors">
            Create
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Subtle architectural line */}
          <div className="w-12 h-px bg-warmgray-300 mx-auto mb-8" />

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-warmgray-800 leading-tight tracking-tight mb-6">
            Curated gift baskets,{" "}
            <span className="italic text-warmgray-500">revealed.</span>
          </h2>

          <p className="text-warmgray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Tell us the occasion, location, and vibe — our AI curates a premium
            gift basket from local artisan producers, revealed in a cinematic
            interactive experience.
          </p>
        </motion.div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 text-center"
        >
          <button
            onClick={() => router.push("/reveal")}
            className="group relative inline-flex items-center gap-2 px-8 py-4
                       bg-warmgray-800 text-parchment rounded-lg
                       font-medium tracking-wide text-sm
                       hover:bg-warmgray-900 transition-all duration-300
                       shadow-lg shadow-warmgray-800/10"
          >
            <span>See a Demo Reveal</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="opacity-60 group-hover:translate-x-0.5 transition-transform"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="text-xs text-warmgray-400 mt-3">
            No account needed · Instant demo
          </p>
        </motion.div>

        {/* Divider */}
        <div className="w-full max-w-lg mx-auto flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-warmgray-200" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-warmgray-400">
            or create your own
          </span>
          <div className="flex-1 h-px bg-warmgray-200" />
        </div>

        {/* Form */}
        <div id="form">
          <BasketGeneratorForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <div className="w-8 h-px bg-warmgray-200 mx-auto mb-4" />
        <p className="text-xs text-warmgray-400">
          Giftstak · Curated with care
        </p>
      </footer>
    </main>
  );
}
