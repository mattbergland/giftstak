"use client";

import { motion } from "framer-motion";
import { useRevealStore } from "@/lib/reveal-store";
import type { BasketZone } from "@/lib/basket-data";

interface IngredientCalloutCardProps {
  zone: BasketZone;
  index: number;
  style?: React.CSSProperties;
}

export default function IngredientCalloutCard({
  zone,
  index,
  style,
}: IngredientCalloutCardProps) {
  const { revealedZones, hoveredZoneId, setHoveredZone, stage } = useRevealStore();
  const isRevealed = revealedZones.includes(index);
  const isHovered = hoveredZoneId === zone.id;
  const isInteractive = stage === "complete";

  if (!isRevealed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{
        opacity: 1,
        scale: isHovered ? 1.03 : 1,
        y: 0,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={style}
      className={`
        absolute w-[260px]
        bg-white/80 backdrop-blur-sm
        border border-warmgray-200
        rounded-lg p-4
        shadow-sm
        transition-all duration-300
        ${isHovered ? "border-accent-gold/60 shadow-md" : ""}
        ${isInteractive ? "cursor-pointer" : ""}
      `}
      onMouseEnter={() => isInteractive && setHoveredZone(zone.id)}
      onMouseLeave={() => isInteractive && setHoveredZone(null)}
    >
      {/* Number badge */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-warmgray-100 flex items-center justify-center">
          <span className="text-xs font-medium text-warmgray-600">{zone.number}</span>
        </div>
        <div className="flex-1 min-w-0">
          {/* Category */}
          <p className="text-[10px] font-medium tracking-widest uppercase text-accent-gold mb-0.5">
            {zone.category}
          </p>
          {/* Item name */}
          <h4 className="font-serif text-base text-warmgray-800 leading-tight">
            {zone.itemName}
          </h4>
          {/* Brand */}
          <p className="text-xs text-warmgray-500 mt-0.5">{zone.brand}</p>
        </div>
      </div>

      {/* Rationale */}
      <p className="text-xs text-warmgray-500 mt-2 leading-relaxed line-clamp-2">
        {zone.rationale}
      </p>

      {/* Source region */}
      <div className="mt-2 pt-2 border-t border-warmgray-100">
        <p className="text-[10px] text-warmgray-400 tracking-wide">
          <span className="uppercase">Origin</span> · {zone.sourceRegion}
        </p>
      </div>
    </motion.div>
  );
}
