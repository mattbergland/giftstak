"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { basketList } from "@/lib/basket-data";
import type { BasketData } from "@/lib/basket-data";

/** Painterly color blobs — positioned absolutely behind content */
function PainterlyBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {/* Top-right: magenta/pink burst */}
      <div
        className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #E84393, #D63384 30%, #C850C0 60%, transparent 75%)",
          filter: "blur(60px)",
        }}
      />
      {/* Top-left: soft blue wash */}
      <div
        className="absolute -top-10 -left-32 w-[360px] h-[320px] rounded-full opacity-[0.10]"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, #6C9BD2, #5B8EC9 40%, transparent 72%)",
          filter: "blur(50px)",
        }}
      />
      {/* Bottom-left: warm gold/orange */}
      <div
        className="absolute -bottom-16 -left-10 w-[300px] h-[300px] rounded-full opacity-[0.11]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #F0A500, #E89B3E 35%, #D4883A 55%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />
      {/* Bottom-right: soft violet */}
      <div
        className="absolute -bottom-24 -right-16 w-[280px] h-[280px] rounded-full opacity-[0.09]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #A569BD, #8E44AD 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Center-right: subtle yellow highlight */}
      <div
        className="absolute top-1/2 right-[10%] w-[200px] h-[200px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, #F4D03F, #F0C040 40%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="h-screen flex flex-col overflow-hidden relative">
      <PainterlyBlobs />

      {/* Nav */}
      <header className="relative z-10 w-full px-6 py-3 flex items-center justify-between max-w-6xl mx-auto flex-shrink-0">
        <h1 className="font-serif text-lg text-warmgray-800 tracking-tight">
          Giftstak
        </h1>
        <p className="hidden sm:block text-xs text-warmgray-400 italic">
          Locally curated gift baskets
        </p>
      </header>

      {/* Hero — compact */}
      <section className="relative z-10 px-6 pt-6 pb-4 max-w-3xl mx-auto w-full text-center flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-warmgray-800 leading-tight tracking-tight mb-3">
            Artisan baskets,{" "}
            <span className="italic text-warmgray-500">locally gathered</span>
          </h2>

          <p className="text-warmgray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Hand-picked ingredients from the best local producers.
            Each basket is a picnic waiting to happen.
          </p>
        </motion.div>
      </section>

      {/* Basket Grid — 4 across, compact */}
      <section className="relative z-10 px-4 sm:px-6 pb-4 max-w-6xl mx-auto w-full flex-1 min-h-0 flex items-start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full"
        >
          {basketList.map((basket, i) => (
            <BasketCard
              key={basket.slug}
              basket={basket}
              index={i}
              onClick={() => router.push(`/reveal?basket=${basket.slug}`)}
            />
          ))}
        </motion.div>
      </section>

      {/* Minimal footer */}
      <footer className="relative z-10 px-6 py-2 text-center flex-shrink-0">
        <p className="text-[10px] text-warmgray-300">
          Giftstak &middot; All ingredients sourced from Good Eggs
        </p>
      </footer>
    </main>
  );
}

function BasketCard({
  basket,
  index,
  onClick,
}: {
  basket: BasketData;
  index: number;
  onClick: () => void;
}) {
  const previewZones = basket.zones.slice(0, 3);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      onClick={onClick}
      className="group text-left bg-white/50 backdrop-blur-sm rounded-xl border border-warmgray-100
                 p-3 sm:p-4 hover:border-warmgray-300 hover:shadow-lg hover:shadow-warmgray-200/40
                 transition-all duration-300 cursor-pointer"
    >
      {/* Product image preview strip */}
      <div className="flex gap-1.5 mb-3">
        {previewZones.map((zone) => (
          <div
            key={zone.id}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-parchment-dark border border-warmgray-100"
          >
            <Image
              src={zone.imageUrl}
              alt={zone.itemName}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-warmgray-100/40 border border-warmgray-100 flex items-center justify-center">
          <span className="text-[10px] text-warmgray-400">+{basket.zones.length - 3}</span>
        </div>
      </div>

      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-0.5">
        {basket.region}
      </p>
      <h3 className="font-serif text-sm sm:text-base text-warmgray-800 mb-1 group-hover:text-warmgray-900 leading-snug">
        {basket.basketName}
      </h3>
      <p className="text-xs text-warmgray-400 leading-relaxed mb-2 hidden sm:block">
        {basket.shortDescription}
      </p>

      {/* Price + CTA */}
      <div className="flex items-center justify-between">
        <span className="font-serif text-base text-warmgray-800">
          ${basket.price}
        </span>
        <span className="text-[10px] text-warmgray-400 group-hover:text-accent-gold transition-colors flex items-center gap-0.5">
          Explore
          <svg
            width="10"
            height="10"
            viewBox="0 0 16 16"
            fill="none"
            className="group-hover:translate-x-0.5 transition-transform"
          >
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </motion.button>
  );
}
