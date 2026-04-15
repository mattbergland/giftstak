"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRevealStore } from "@/lib/reveal-store";
import type { BasketZone } from "@/lib/basket-data";
import type { PanelScreenPosition } from "@/lib/panel-positions";
import { panelPositions } from "@/lib/panel-positions";
import IngredientCalloutCard from "./IngredientCalloutCard";

interface CalloutOverlayProps {
  zones: BasketZone[];
  anchorScreenPositions: Record<string, { x: number; y: number }>;
}

export default function CalloutOverlay({
  zones,
  anchorScreenPositions,
}: CalloutOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { revealedZones } = useRevealStore();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getPanelPixelPosition = useCallback(
    (panelPos: PanelScreenPosition) => {
      return {
        x: (parseFloat(panelPos.left) / 100) * containerSize.width,
        y: (parseFloat(panelPos.top) / 100) * containerSize.height,
      };
    },
    [containerSize]
  );

  const getCardCenter = useCallback(
    (panelPos: PanelScreenPosition) => {
      const pos = getPanelPixelPosition(panelPos);
      const cardWidth = 260;
      const cardHeight = 140;
      return {
        x: pos.x + cardWidth / 2,
        y: pos.y + cardHeight / 2,
      };
    },
    [getPanelPixelPosition]
  );

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20">
      {/* SVG layer for lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {zones.map((zone, index) => {
          if (!revealedZones.includes(index)) return null;

          const anchorPos = anchorScreenPositions[zone.id];
          const panelPos = panelPositions[zone.panelPosition];
          if (!anchorPos || !panelPos) return null;

          const cardCenter = getCardCenter(panelPos);

          // Create a smooth curve from anchor to card
          const startX = anchorPos.x;
          const startY = anchorPos.y;
          const endX = cardCenter.x;
          const endY = cardCenter.y;

          // Control point for bezier curve
          const midX = (startX + endX) / 2;
          const cpX = panelPos.side === "left" ? midX - 40 : midX + 40;
          const cpY = (startY + endY) / 2;

          const pathD = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;

          return (
            <g key={zone.id}>
              {/* Dot at anchor point */}
              <circle
                cx={startX}
                cy={startY}
                r={3}
                fill="#C4A35A"
                opacity={0.8}
              />
              {/* Line from anchor to card */}
              <path
                d={pathD}
                className="callout-line animate"
                stroke="#B8AFA4"
                strokeWidth={1}
                fill="none"
                strokeLinecap="round"
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              />
              {/* Dot at card end */}
              <circle
                cx={endX}
                cy={endY}
                r={2}
                fill="#B8AFA4"
                opacity={0.6}
              />
            </g>
          );
        })}
      </svg>

      {/* Callout cards */}
      {zones.map((zone, index) => {
        const panelPos = panelPositions[zone.panelPosition];
        if (!panelPos) return null;

        return (
          <div
            key={zone.id}
            className="pointer-events-auto"
            style={{
              position: "absolute",
              top: panelPos.top,
              left: panelPos.left,
            }}
          >
            <IngredientCalloutCard zone={zone} index={index} />
          </div>
        );
      })}
    </div>
  );
}
