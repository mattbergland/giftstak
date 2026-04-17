/**
 * Panel position configuration for callout cards.
 *
 * Maps panel position keys to screen-space coordinates (as percentages).
 * These define where the callout cards are placed on the screen edge.
 *
 * To tune: adjust the top/left percentages below.
 * The callout overlay SVG lines will connect from the 3D anchor
 * to these panel positions.
 */

export interface PanelScreenPosition {
  top: string;
  left: string;
  /** Side of the screen: determines line path curvature */
  side: "left" | "right";
}

export const panelPositions: Record<string, PanelScreenPosition> = {
  "left-top": {
    top: "8%",
    left: "2%",
    side: "left",
  },
  "right-top": {
    top: "8%",
    left: "72%",
    side: "right",
  },
  "left-mid": {
    top: "36%",
    left: "2%",
    side: "left",
  },
  "right-mid": {
    top: "36%",
    left: "72%",
    side: "right",
  },
  "left-bottom": {
    top: "64%",
    left: "2%",
    side: "left",
  },
  "right-bottom": {
    top: "64%",
    left: "72%",
    side: "right",
  },
};
