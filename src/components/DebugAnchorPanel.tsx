"use client";

import { useState } from "react";

interface DebugAnchorPanelProps {
  anchors: Record<string, [number, number, number]>;
  onAnchorChange: (zoneId: string, axis: 0 | 1 | 2, value: number) => void;
  onCopyAnchors: () => void;
}

const ZONE_COLORS: Record<string, string> = {
  "zone-1": "#EF4444", // red
  "zone-2": "#F97316", // orange
  "zone-3": "#EAB308", // yellow
  "zone-4": "#22C55E", // green
  "zone-5": "#3B82F6", // blue
  "zone-6": "#A855F7", // purple
};

const AXIS_LABELS = ["X", "Y", "Z"] as const;
const STEP = 0.05;

export { ZONE_COLORS };

export default function DebugAnchorPanel({
  anchors,
  onAnchorChange,
  onCopyAnchors,
}: DebugAnchorPanelProps) {
  const [selectedZone, setSelectedZone] = useState<string>("zone-1");
  const [step, setStep] = useState(STEP);

  const selectedPos = anchors[selectedZone] ?? [0, 0, 0];

  return (
    <div className="fixed top-16 right-4 z-50 bg-warmgray-900/95 text-white rounded-lg shadow-2xl w-72 text-xs font-mono backdrop-blur-sm border border-warmgray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-warmgray-700">
        <span className="text-[10px] uppercase tracking-wider text-warmgray-400">
          Anchor Debug
        </span>
        <button
          onClick={onCopyAnchors}
          className="text-[10px] px-2 py-0.5 bg-accent-gold/20 text-accent-gold rounded hover:bg-accent-gold/30 transition-colors"
          title="Copy anchor config to clipboard"
        >
          Copy Config
        </button>
      </div>

      {/* Zone selector */}
      <div className="px-3 py-2 border-b border-warmgray-700">
        <div className="grid grid-cols-6 gap-1">
          {Object.keys(anchors).map((zoneId) => (
            <button
              key={zoneId}
              onClick={() => setSelectedZone(zoneId)}
              className={`px-1 py-1 rounded text-[9px] transition-all ${
                selectedZone === zoneId
                  ? "ring-2 ring-white scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: ZONE_COLORS[zoneId] ?? "#888" }}
            >
              {zoneId.replace("zone-", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Selected zone controls */}
      <div className="px-3 py-2 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: ZONE_COLORS[selectedZone] ?? "#888" }}
          />
          <span className="text-warmgray-300">{selectedZone}</span>
        </div>

        {AXIS_LABELS.map((label, axis) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-4 text-warmgray-400">{label}</span>
            <button
              onClick={() =>
                onAnchorChange(selectedZone, axis as 0 | 1 | 2, selectedPos[axis] - step)
              }
              className="w-6 h-6 rounded bg-warmgray-700 hover:bg-warmgray-600 flex items-center justify-center transition-colors"
            >
              -
            </button>
            <span className="w-16 text-center text-warmgray-200 tabular-nums">
              {selectedPos[axis].toFixed(3)}
            </span>
            <button
              onClick={() =>
                onAnchorChange(selectedZone, axis as 0 | 1 | 2, selectedPos[axis] + step)
              }
              className="w-6 h-6 rounded bg-warmgray-700 hover:bg-warmgray-600 flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        ))}

        {/* Step size control */}
        <div className="flex items-center gap-2 pt-1 border-t border-warmgray-700">
          <span className="text-warmgray-400 text-[10px]">Step</span>
          {[0.01, 0.05, 0.1, 0.25].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
                step === s
                  ? "bg-accent-gold text-warmgray-900"
                  : "bg-warmgray-700 text-warmgray-400 hover:bg-warmgray-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* All zones overview */}
      <div className="px-3 py-2 border-t border-warmgray-700 max-h-40 overflow-y-auto">
        <p className="text-[10px] text-warmgray-500 uppercase tracking-wider mb-1">
          All Anchors
        </p>
        {Object.entries(anchors).map(([zoneId, pos]) => (
          <div
            key={zoneId}
            className={`flex items-center gap-1 py-0.5 cursor-pointer hover:bg-warmgray-800 rounded px-1 ${
              selectedZone === zoneId ? "bg-warmgray-800" : ""
            }`}
            onClick={() => setSelectedZone(zoneId)}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: ZONE_COLORS[zoneId] ?? "#888" }}
            />
            <span className="text-warmgray-400 w-12">{zoneId}</span>
            <span className="text-warmgray-300 tabular-nums">
              [{pos[0].toFixed(2)}, {pos[1].toFixed(2)}, {pos[2].toFixed(2)}]
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
