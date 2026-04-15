"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useRevealStore } from "@/lib/reveal-store";
import { ANIMATION_CONFIG, ASSEMBLING_PHRASES } from "@/lib/animation-config";
import { motion, AnimatePresence } from "framer-motion";

interface RevealSequenceControllerProps {
  totalZones: number;
}

export default function RevealSequenceController({
  totalZones,
}: RevealSequenceControllerProps) {
  const {
    stage,
    setStage,
    revealZone,
    setActiveRevealIndex,
    setIsPlaying,
    setProgress,
  } = useRevealStore();

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const addTimeout = useCallback(
    (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
      return id;
    },
    []
  );

  const runSequence = useCallback(() => {
    clearAllTimeouts();
    setIsPlaying(true);
    setStage("loading");
    setProgress(0);

    let elapsed = 0;
    const totalDuration =
      ANIMATION_CONFIG.assemblingDuration +
      ANIMATION_CONFIG.boxSettleDuration +
      ANIMATION_CONFIG.lidOpenDuration +
      ANIMATION_CONFIG.postLidPause +
      totalZones * (ANIMATION_CONFIG.compartmentRevealDuration + ANIMATION_CONFIG.compartmentPause);

    // Stage 0 → 1: Box appear
    elapsed += ANIMATION_CONFIG.assemblingDuration;
    addTimeout(() => {
      setStage("box-appear");
      setProgress(elapsed / totalDuration);
    }, elapsed);

    // Stage 1 → 2: Lid opens
    elapsed += ANIMATION_CONFIG.boxSettleDuration;
    addTimeout(() => {
      setStage("lid-open");
      setProgress(elapsed / totalDuration);
    }, elapsed);

    // After lid opens, pause then start compartments
    elapsed += ANIMATION_CONFIG.lidOpenDuration + ANIMATION_CONFIG.postLidPause;
    addTimeout(() => {
      setStage("revealing");
      setProgress(elapsed / totalDuration);
    }, elapsed);

    // Compartments reveal one by one
    for (let i = 0; i < totalZones; i++) {
      const compartmentDelay =
        elapsed +
        i * (ANIMATION_CONFIG.compartmentRevealDuration + ANIMATION_CONFIG.compartmentPause);

      addTimeout(() => {
        setActiveRevealIndex(i);
        revealZone(i);
        setProgress(compartmentDelay / totalDuration);
      }, compartmentDelay);
    }

    // Final: complete
    const finalDelay =
      elapsed +
      totalZones * (ANIMATION_CONFIG.compartmentRevealDuration + ANIMATION_CONFIG.compartmentPause);

    addTimeout(() => {
      setStage("complete");
      setActiveRevealIndex(-1);
      setIsPlaying(false);
      setProgress(1);
    }, finalDelay);
  }, [
    totalZones,
    clearAllTimeouts,
    addTimeout,
    setStage,
    setIsPlaying,
    setProgress,
    setActiveRevealIndex,
    revealZone,
  ]);

  // Auto-start on mount
  useEffect(() => {
    runSequence();
    return clearAllTimeouts;
  }, [runSequence, clearAllTimeouts]);

  // Expose replay and skip through store subscription
  useEffect(() => {
    const unsub = useRevealStore.subscribe((state, prevState) => {
      if (state.stage === "loading" && prevState.stage !== "loading" && !state.isPlaying) {
        // Replay triggered
        runSequence();
      }
      if (state.skipped && !prevState.skipped) {
        // Skip triggered — cancel all pending timeouts
        clearAllTimeouts();
      }
    });
    return unsub;
  }, [runSequence, clearAllTimeouts]);

  return (
    <AnimatePresence>
      {stage === "loading" && <AssemblingOverlay />}
    </AnimatePresence>
  );
}

/** Full-screen overlay shown during Stage 0 */
function AssemblingOverlay() {
  const phraseRef = useRef(0);
  const [currentPhrase, setCurrentPhrase] = useState(ASSEMBLING_PHRASES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      phraseRef.current = (phraseRef.current + 1) % ASSEMBLING_PHRASES.length;
      setCurrentPhrase(ASSEMBLING_PHRASES[phraseRef.current]);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-parchment/90"
    >
      <div className="text-center space-y-4">
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-accent-gold"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <motion.p
          key={currentPhrase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="font-serif text-lg text-warmgray-600 italic"
        >
          {currentPhrase}
        </motion.p>
      </div>
    </motion.div>
  );
}
