"use client";

import Image from "next/image";
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
        rounded-xl p-3
        shadow-sm
        transition-all duration-300
        ${isHovered ? "border-accent-gold/60 shadow-md" : ""}
        ${isInteractive ? "cursor-pointer" : ""}
      `}
      onMouseEnter={() => isInteractive && setHoveredZone(zone.id)}
      onMouseLeave={() => isInteractive && setHoveredZone(null)}
    >
      {/* Product image + content */}
      <div className="flex items-start gap-3">
        {/* Crayon-styled product image */}
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-parchment-dark border border-warmgray-100">
          <Image
            src={zone.imageUrl}
            alt={zone.itemName}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          {/* Category */}
          <p className="text-[10px] font-medium tracking-widest uppercase text-accent-gold mb-0.5">
            {zone.category}
          </p>
          {/* Item name */}
          <h4 className="font-serif text-sm text-warmgray-800 leading-tight">
            {zone.itemName}
          </h4>
          {/* Brand */}
          <p className="text-[10px] text-warmgray-500 mt-0.5">{zone.brand}</p>
        </div>
      </div>

      {/* Source region */}
      <div className="mt-2 pt-1.5 border-t border-warmgray-100">
        <p className="text-[10px] text-warmgray-400 tracking-wide">
          <span className="uppercase">Origin</span> · {zone.sourceRegion}
        </p>
      </div>
    </motion.div>
  );
}
