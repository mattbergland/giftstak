"use client";

import { motion } from "framer-motion";
import { useRevealStore } from "@/lib/reveal-store";

export default function ReplayRevealButton() {
  const { stage, replay, isPlaying } = useRevealStore();

  if (stage !== "complete") return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onClick={replay}
      disabled={isPlaying}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                 border border-warmgray-200 bg-white/60
                 text-warmgray-600 text-sm
                 hover:border-warmgray-300 hover:text-warmgray-800
                 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="opacity-60"
      >
        <path
          d="M1.5 1.5V5.5H5.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.1 8.5A5 5 0 1 0 3 4L1.5 5.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Replay Reveal
    </motion.button>
  );
}
