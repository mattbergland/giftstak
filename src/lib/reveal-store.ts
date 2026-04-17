/**
 * Zustand store for the reveal sequence state.
 *
 * Manages the current stage, which zones are revealed,
 * hover interactions, and playback controls.
 */
import { create } from "zustand";

export type RevealStage =
  | "loading"      // Stage 0: assembling message
  | "box-appear"   // Stage 1: box settles in
  | "lid-open"     // Stage 2: lid animates open
  | "revealing"    // Stage 3+: compartments reveal one by one
  | "complete";    // All revealed, interaction unlocked

interface RevealState {
  /** Current overall stage */
  stage: RevealStage;

  /** Which zone indices have been revealed (0-based) */
  revealedZones: number[];

  /** Currently revealing zone index (-1 if none) */
  activeRevealIndex: number;

  /** Zone hovered by user (from card or 3D) */
  hoveredZoneId: string | null;

  /** Whether the sequence is currently playing */
  isPlaying: boolean;

  /** Whether user skipped to end */
  skipped: boolean;

  /** Progress through the sequence (0-1) */
  progress: number;

  // Actions
  setStage: (stage: RevealStage) => void;
  revealZone: (index: number) => void;
  setActiveRevealIndex: (index: number) => void;
  setHoveredZone: (zoneId: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  skipToEnd: (totalZones: number) => void;
  replay: () => void;
  setProgress: (progress: number) => void;
}

export const useRevealStore = create<RevealState>((set) => ({
  stage: "loading",
  revealedZones: [],
  activeRevealIndex: -1,
  hoveredZoneId: null,
  isPlaying: false,
  skipped: false,
  progress: 0,

  setStage: (stage) => set({ stage }),

  revealZone: (index) =>
    set((state) => ({
      revealedZones: state.revealedZones.includes(index)
        ? state.revealedZones
        : [...state.revealedZones, index],
    })),

  setActiveRevealIndex: (index) => set({ activeRevealIndex: index }),

  setHoveredZone: (zoneId) => set({ hoveredZoneId: zoneId }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  skipToEnd: (totalZones) =>
    set({
      stage: "complete",
      revealedZones: Array.from({ length: totalZones }, (_, i) => i),
      activeRevealIndex: -1,
      isPlaying: false,
      skipped: true,
      progress: 1,
    }),

  replay: () =>
    set({
      stage: "loading",
      revealedZones: [],
      activeRevealIndex: -1,
      hoveredZoneId: null,
      isPlaying: false,
      skipped: false,
      progress: 0,
    }),

  setProgress: (progress) => set({ progress }),
}));
