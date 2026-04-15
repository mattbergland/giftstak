/**
 * Animation timing configuration for the reveal sequence.
 *
 * All durations are in milliseconds.
 * Edit these values to tune the pacing of the reveal experience.
 */

export const ANIMATION_CONFIG = {
  /** Stage 0 → 1: How long to show "assembling" message */
  assemblingDuration: 2000,

  /** Stage 1: Box appear and settle duration */
  boxSettleDuration: 1500,

  /** Stage 2: Lid opening animation duration */
  lidOpenDuration: 1800,

  /** Pause after lid opens before first compartment */
  postLidPause: 800,

  /** Per-compartment reveal duration (highlight + line + card) */
  compartmentRevealDuration: 1400,

  /** Pause between compartment reveals */
  compartmentPause: 400,

  /** Camera push duration during lid opening */
  cameraPushDuration: 2000,

  /** Idle float animation speed (seconds per cycle) */
  idleFloatSpeed: 6,

  /** Idle rotation speed (radians per second) — very subtle */
  idleRotationSpeed: 0.08,

  /** Total approximate reveal time: ~12 seconds */
} as const;

/**
 * Loading copy that cycles during the assembling phase.
 */
export const ASSEMBLING_PHRASES = [
  "Curating your selection…",
  "Sourcing the finest ingredients…",
  "Arranging the perfect composition…",
  "Adding the finishing touches…",
  "Preparing your reveal…",
];

/**
 * Camera configuration
 */
export const CAMERA_CONFIG = {
  /** Initial camera position (3/4 composed view) */
  initialPosition: [3.5, 2.8, 3.5] as [number, number, number],

  /** Camera target (look-at point) */
  target: [0, 0.2, 0] as [number, number, number],

  /** Camera position during/after lid open (subtle push in) */
  revealPosition: [3.0, 2.2, 3.0] as [number, number, number],

  /** Field of view */
  fov: 40,

  /** OrbitControls constraints */
  minPolarAngle: Math.PI / 6,
  maxPolarAngle: Math.PI / 2.5,
  minDistance: 3,
  maxDistance: 7,
  enablePan: false,
} as const;
