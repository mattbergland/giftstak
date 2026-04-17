"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { basketList } from "@/lib/basket-data";
import type { BasketData } from "@/lib/basket-data";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="font-serif text-xl text-warmgray-800 tracking-tight">
          Giftstak
        </h1>
        <nav className="hidden sm:flex gap-6 text-sm text-warmgray-400">
          <a href="#baskets" className="hover:text-warmgray-600 transition-colors">
            Collections
          </a>
          <a href="#how" className="hover:text-warmgray-600 transition-colors">
            How It Works
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-12 h-px bg-warmgray-300 mx-auto mb-8" />

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-warmgray-800 leading-tight tracking-tight mb-6">
            Artisan baskets,{" "}
            <span className="italic text-warmgray-500">locally gathered</span>
          </h2>

          <p className="text-warmgray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
            Hand-picked ingredients from the best local producers, arranged with care.
            Each basket is a picnic waiting to happen &mdash; rustic, elegant, and rooted in place.
          </p>

          <p className="text-warmgray-400 text-sm max-w-lg mx-auto">
            Choose a collection below to explore what&apos;s inside.
          </p>
        </motion.div>
      </section>

      {/* Basket Grid */}
      <section id="baskets" className="px-6 pb-16 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
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

      {/* How It Works */}
      <section id="how" className="px-6 py-16 border-t border-warmgray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold text-center mb-3">
              How It Works
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-warmgray-800 text-center mb-10">
              From local producers to your doorstep
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose a Collection",
                  desc: "Pick a city-inspired gift basket curated with the best local artisan ingredients.",
                },
                {
                  step: "02",
                  title: "Preview the Reveal",
                  desc: "Explore every item in an interactive 3D reveal that shows exactly what\u2019s inside.",
                },
                {
                  step: "03",
                  title: "Send the Gift",
                  desc: "We source, assemble, and deliver your basket with care and a personal touch.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-warmgray-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xs font-medium text-warmgray-500">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-warmgray-800 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-warmgray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 bg-warmgray-800 text-parchment text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl mb-4">
            The perfect gift, rooted in place
          </h3>
          <p className="text-parchment/70 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Every basket celebrates the best artisan producers from a specific city.
            Local ingredients, premium presentation, delivered anywhere.
          </p>
          <a
            href="#baskets"
            className="inline-flex items-center gap-2 px-8 py-3.5
                       bg-parchment text-warmgray-800 rounded-lg
                       font-medium tracking-wide text-sm
                       hover:bg-white transition-colors duration-200"
          >
            Browse Collections
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <div className="w-8 h-px bg-warmgray-200 mx-auto mb-4" />
        <p className="text-xs text-warmgray-400">
          Giftstak · Locally curated gift baskets
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
  // Show first 3 product images as a preview strip
  const previewZones = basket.zones.slice(0, 3);

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 * index }}
      onClick={onClick}
      className="group text-left bg-white/60 rounded-xl border border-warmgray-100
                 p-5 hover:border-warmgray-300 hover:shadow-lg hover:shadow-warmgray-200/50
                 transition-all duration-300 cursor-pointer"
    >
      {/* Product image preview strip */}
      <div className="flex gap-2 mb-4">
        {previewZones.map((zone) => (
          <div
            key={zone.id}
            className="w-16 h-16 rounded-lg overflow-hidden bg-parchment-dark border border-warmgray-100"
          >
            <Image
              src={zone.imageUrl}
              alt={zone.itemName}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="w-16 h-16 rounded-lg bg-warmgray-100/50 border border-warmgray-100 flex items-center justify-center">
          <span className="text-xs text-warmgray-400">+{basket.zones.length - 3}</span>
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-1">
        {basket.region}
      </p>
      <h3 className="font-serif text-lg text-warmgray-800 mb-2 group-hover:text-warmgray-900">
        {basket.basketName}
      </h3>
      <p className="text-sm text-warmgray-400 leading-relaxed mb-4">
        {basket.shortDescription}
      </p>

      {/* Price + CTA */}
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg text-warmgray-800">
          ${basket.price}
        </span>
        <span className="text-xs text-warmgray-400 group-hover:text-accent-gold transition-colors flex items-center gap-1">
          Explore
          <svg
            width="12"
            height="12"
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
