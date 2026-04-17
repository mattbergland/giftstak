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

      {/* Nav + inline tagline */}
      <header className="relative z-10 w-full px-6 py-2 flex items-center justify-between max-w-6xl mx-auto flex-shrink-0">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-lg text-warmgray-800 tracking-tight">
            Giftstak
          </h1>
          <p className="hidden sm:block text-xs text-warmgray-400 italic">
            Artisan baskets, locally gathered
          </p>
        </div>
        <p className="text-[10px] text-warmgray-300">
          All ingredients from Good Eggs
        </p>
      </header>

      {/* Basket Grid — THE main event, takes all available space */}
      <section className="relative z-10 px-4 sm:px-6 flex-1 min-h-0 flex flex-col justify-center max-w-6xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-xl sm:text-2xl text-warmgray-800 tracking-tight mb-3 sm:mb-4 text-center"
        >
          Choose your collection
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
      className="group text-left flex flex-col bg-white/50 backdrop-blur-sm rounded-xl border border-warmgray-100
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
        {basket.zones.length > 3 && (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-warmgray-100/40 border border-warmgray-100 flex items-center justify-center">
            <span className="text-[10px] text-warmgray-400">+{basket.zones.length - 3}</span>
          </div>
        )}
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
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-serif text-lg sm:text-xl text-warmgray-800 font-medium">
          ${basket.price}
        </span>
        <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-warmgray-800 text-white
                         group-hover:bg-accent-gold transition-colors">
          Select
        </span>
      </div>
    </motion.button>
  );
}
