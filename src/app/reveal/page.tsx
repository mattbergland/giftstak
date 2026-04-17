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
    <main className="h-screen flex flex-col overflow-hidden bg-parchment relative">
      {/* Header — slim */}
      <header className="w-full px-4 sm:px-6 py-2 flex items-center justify-between z-40 relative flex-shrink-0">
        <a href="/" className="font-serif text-lg text-warmgray-800 tracking-tight hover:text-warmgray-600 transition-colors">
          Giftstak
        </a>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-xs text-warmgray-400 hover:text-warmgray-600 transition-colors"
          >
            ← Collections
          </a>
          <button
            onClick={() => setDebugMode((d) => !d)}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors font-mono ${
              debugMode
                ? "bg-red-500/10 border-red-400 text-red-500"
                : "bg-warmgray-100 border-warmgray-200 text-warmgray-400 hover:text-warmgray-600"
            }`}
          >
            {debugMode ? "Debug ON" : "Debug"}
          </button>
          <ReplayRevealButton />
        </div>
      </header>

      {/* 3D scene + overlaid basket info — takes all available space */}
      <div className="relative flex-1 min-h-0">
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

        {/* Basket title — overlaid top-left on the scene */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: stage !== "loading" ? 1 : 0, y: stage !== "loading" ? 0 : -10 }}
          transition={{ duration: 0.6 }}
          className="absolute top-3 left-4 sm:left-6 z-30 text-left max-w-xs"
        >
          <p className="text-[9px] uppercase tracking-[0.25em] text-accent-gold mb-0.5">
            {basket.region}
          </p>
          <h2 className="font-serif text-lg sm:text-xl text-warmgray-800 leading-tight">
            {basket.basketName}
          </h2>
          <p className="text-xs text-warmgray-400 mt-0.5 leading-snug hidden sm:block">
            {basket.shortDescription}
          </p>
        </motion.div>

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

      {/* Bottom bar — Order CTA always visible */}
      <div className="flex-shrink-0 z-40 relative border-t border-warmgray-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div>
            <p className="font-serif text-lg text-warmgray-800 font-medium">
              ${basket.price}
            </p>
            <p className="text-[10px] text-warmgray-400">
              Delivery included · Ships 3–5 days
            </p>
          </div>
          <button
            className="px-5 py-2 bg-warmgray-800 text-parchment rounded-lg
                       font-medium tracking-wide text-xs sm:text-sm
                       hover:bg-warmgray-900 transition-colors duration-200
                       shadow-lg shadow-warmgray-800/10"
          >
            Order This Basket
          </button>
        </div>
      </div>
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
