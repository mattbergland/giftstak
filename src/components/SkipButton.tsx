"use client";

import { motion } from "framer-motion";
import { useRevealStore } from "@/lib/reveal-store";

interface SkipButtonProps {
  totalZones: number;
}

export default function SkipButton({ totalZones }: SkipButtonProps) {
  const { stage, skipToEnd } = useRevealStore();

  if (stage === "complete" || stage === "loading") return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1 }}
      onClick={() => skipToEnd(totalZones)}
      className="absolute bottom-6 right-6 z-30
                 px-3 py-1.5 rounded-md
                 text-xs text-warmgray-400
                 border border-warmgray-200 bg-white/60
                 hover:text-warmgray-600 hover:border-warmgray-300
                 transition-all duration-200"
    >
      Skip →
    </motion.button>
  );
}
