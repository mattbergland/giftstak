/**
 * Anchor configuration for the gift box model.
 *
 * Each anchor maps a zone ID to a 3D position [x, y, z] on the gift box model.
 * These coordinates are in the MODEL’s local coordinate space (after 1.8× scale).
 * They sit at the cross-points of the internal divider slats.
 *
 * Coordinate system (looking at the box from the default 3/4 camera view):
 *   x: left(-) / right(+)
 *   y: down(-) / up(+)
 *   z: back(-) / front(+)
 *
 * Derived from GLB geometry analysis:
 *   Vertical dividers at raw X ≈ -0.40 and X ≈ 0.25
 *   Horizontal dividers at raw Z ≈ -0.11, Z ≈ 0.24, Z ≈ 0.54
 *   Divider tops at raw Y ≈ -0.50
 *   All values multiplied by model scale (1.8).
 *
 * Use the Debug Anchors panel on /reveal to fine-tune these at runtime,
 * then Copy Config to export updated values.
 */
export const basketAnchors: Record<string, [number, number, number]> = {
  "zone-1": [-0.720, -0.900, -0.198],
  "zone-2": [0.450, -0.900, -0.198],
  "zone-3": [-0.720, -0.900, 0.432],
  "zone-4": [0.450, -0.900, 0.432],
  "zone-5": [-0.720, -0.900, 0.972],
  "zone-6": [0.450, -0.900, 0.972],
};
