"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRevealStore } from "@/lib/reveal-store";
import { getBasketBySlug } from "@/lib/basket-data";
import { basketAnchors } from "@/lib/anchor-config";
import CalloutOverlay from "@/components/CalloutOverlay";
import RevealSequenceController from "@/components/RevealSequenceController";
import ResultTabs from "@/components/ResultTabs";
import ReplayRevealButton from "@/components/ReplayRevealButton";
import SkipButton from "@/components/SkipButton";
import DebugAnchorPanel from "@/components/DebugAnchorPanel";

// Dynamic import for the 3D scene (no SSR)
const BasketRevealScene = dynamic(
  () => import("@/components/BasketRevealScene"),
  { ssr: false }
);

function RevealPageContent() {
  const searchParams = useSearchParams();
  const basketSlug = searchParams.get("basket");
  const basket = getBasketBySlug(basketSlug);

  const { stage } = useRevealStore();
  const [anchorScreenPositions, setAnchorScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [debugMode, setDebugMode] = useState(false);
  const [editableAnchors, setEditableAnchors] = useState<
    Record<string, [number, number, number]>
  >({ ...basketAnchors });

  const handleAnchorPositionsUpdate = useCallback(
    (positions: Record<string, { x: number; y: number }>) => {
      setAnchorScreenPositions(positions);
    },
    []
  );

  const handleAnchorChange = useCallback(
    (zoneId: string, axis: 0 | 1 | 2, value: number) => {
      setEditableAnchors((prev) => {
        const current = prev[zoneId] ?? [0, 0, 0];
        const updated: [number, number, number] = [...current];
        updated[axis] = Math.round(value * 1000) / 1000;
        return { ...prev, [zoneId]: updated };
      });
    },
    []
  );

  const handleCopyAnchors = useCallback(() => {
    const lines = Object.entries(editableAnchors)
      .map(
        ([id, pos]) =>
          `  "${id}": [${pos[0].toFixed(3)}, ${pos[1].toFixed(3)}, ${pos[2].toFixed(3)}],`
      )
      .join("\n");
    const config = `export const basketAnchors: Record<string, [number, number, number]> = {\n${lines}\n};`;
    navigator.clipboard.writeText(config).then(() => {
      alert("Anchor config copied to clipboard!");
    });
  }, [editableAnchors]);

  return (
    <main className="min-h-screen flex flex-col bg-parchment">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-40 relative">
        <a href="/" className="font-serif text-lg text-warmgray-800 tracking-tight hover:text-warmgray-600 transition-colors">
          Giftstak
        </a>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-xs text-warmgray-400 hover:text-warmgray-600 transition-colors"
          >
            All Collections
          </a>
          <button
            onClick={() => setDebugMode((d) => !d)}
            className={`text-[10px] px-3 py-1 rounded-full border transition-colors font-mono ${
              debugMode
                ? "bg-red-500/10 border-red-400 text-red-500"
                : "bg-warmgray-100 border-warmgray-200 text-warmgray-400 hover:text-warmgray-600"
            }`}
          >
            {debugMode ? "Debug ON" : "Debug Anchors"}
          </button>
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
          {basket.region}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-warmgray-800">
          {basket.basketName}
        </h2>
        <p className="text-sm text-warmgray-400 mt-1 max-w-md mx-auto">
          {basket.description}
        </p>
        <p className="font-serif text-lg text-warmgray-600 mt-2">
          ${basket.price}
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
              anchors={editableAnchors}
              onAnchorPositionsUpdate={handleAnchorPositionsUpdate}
              debugMode={debugMode}
            />
          </Suspense>
        </div>

        {/* Callout overlay */}
        <CalloutOverlay
          zones={basket.zones}
          anchorScreenPositions={anchorScreenPositions}
        />

        {/* Debug panel */}
        {debugMode && (
          <DebugAnchorPanel
            anchors={editableAnchors}
            onAnchorChange={handleAnchorChange}
            onCopyAnchors={handleCopyAnchors}
          />
        )}

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

      {/* Order CTA */}
      <section className="max-w-3xl mx-auto w-full px-6 pb-10 text-center">
        <button
          className="px-8 py-3.5 bg-warmgray-800 text-parchment rounded-lg
                     font-medium tracking-wide text-sm
                     hover:bg-warmgray-900 transition-colors duration-200
                     shadow-lg shadow-warmgray-800/10"
        >
          Order This Basket &mdash; ${basket.price}
        </button>
        <p className="text-xs text-warmgray-400 mt-3">
          Bay Area delivery included · Ships in 3–5 days
        </p>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center border-t border-warmgray-100">
        <p className="text-xs text-warmgray-400">
          Giftstak · Locally curated gift baskets · All ingredients sourced from local artisan producers
        </p>
      </footer>
    </main>
  );
}

export default function RevealPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-parchment">
          <p className="text-warmgray-400 text-sm">Loading…</p>
        </div>
      }
    >
      <RevealPageContent />
    </Suspense>
  );
}
