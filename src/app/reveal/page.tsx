"use client";

import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRevealStore } from "@/lib/reveal-store";
import { demoBasket } from "@/lib/basket-data";
import { basketAnchors } from "@/lib/anchor-config";
import CalloutOverlay from "@/components/CalloutOverlay";
import RevealSequenceController from "@/components/RevealSequenceController";
import ResultTabs from "@/components/ResultTabs";
import ReplayRevealButton from "@/components/ReplayRevealButton";
import SkipButton from "@/components/SkipButton";

// Dynamic import for the 3D scene (no SSR)
const BasketRevealScene = dynamic(
  () => import("@/components/BasketRevealScene"),
  { ssr: false }
);

export default function RevealPage() {
  const { stage } = useRevealStore();
  const basket = demoBasket;
  const [anchorScreenPositions, setAnchorScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const handleAnchorPositionsUpdate = useCallback(
    (positions: Record<string, { x: number; y: number }>) => {
      setAnchorScreenPositions(positions);
    },
    []
  );

  return (
    <main className="min-h-screen flex flex-col bg-parchment">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-40 relative">
        <a href="/" className="font-serif text-lg text-warmgray-800 tracking-tight hover:text-warmgray-600 transition-colors">
          Giftstak
        </a>
        <div className="flex items-center gap-4">
          <ReplayRevealButton />
        </div>
      </header>

      {/* Basket title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: stage !== "loading" ? 1 : 0, y: stage !== "loading" ? 0 : -10 }}
        transition={{ duration: 0.6 }}
        className="text-center px-6 pt-2 pb-4 z-30 relative"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold mb-1">
          Your Curated Selection
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-warmgray-800">
          {basket.basketName}
        </h2>
        <p className="text-sm text-warmgray-400 mt-1 max-w-md mx-auto">
          {basket.description}
        </p>
      </motion.div>

      {/* 3D Reveal Scene with overlay */}
      <div className="relative flex-1 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-warmgray-400 text-sm">Loading scene…</p>
              </div>
            }
          >
            <BasketRevealScene
              glbUrl="/models/gift-box.glb"
              anchors={basketAnchors}
              onAnchorPositionsUpdate={handleAnchorPositionsUpdate}
            />
          </Suspense>
        </div>

        {/* Callout overlay */}
        <CalloutOverlay
          zones={basket.zones}
          anchorScreenPositions={anchorScreenPositions}
        />

        {/* Reveal controller (manages timing) */}
        <RevealSequenceController totalZones={basket.zones.length} />

        {/* Skip button */}
        <SkipButton totalZones={basket.zones.length} />
      </div>

      {/* Bottom section: tabs */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "complete" ? 1 : 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto w-full px-6 py-10"
      >
        <div className="w-12 h-px bg-warmgray-200 mx-auto mb-8" />
        <ResultTabs basket={basket} />
      </motion.section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center border-t border-warmgray-100">
        <p className="text-xs text-warmgray-400">
          Giftstak · Curated with care · All ingredients sourced from local artisan producers
        </p>
      </footer>
    </main>
  );
}
