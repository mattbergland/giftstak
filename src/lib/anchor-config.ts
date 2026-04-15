/**
 * Anchor configuration for the gift box model.
 *
 * Each anchor maps a zone ID to a 3D position [x, y, z] on the gift box model.
 * These coordinates are used to project callout lines from the 3D scene
 * to the 2D overlay panels.
 *
 * To tune: adjust the [x, y, z] values below. The coordinate system is:
 *   x: left(-) / right(+)
 *   y: down(-) / up(+)
 *   z: back(-) / front(+)
 *
 * These are placeholder values — tune them once the GLB is loaded.
 */
export const basketAnchors: Record<string, [number, number, number]> = {
  "zone-1": [-0.4, 0.15, 0.3],
  "zone-2": [0.4, 0.15, 0.3],
  "zone-3": [-0.4, 0.0, 0.0],
  "zone-4": [0.4, 0.0, 0.0],
  "zone-5": [-0.4, -0.1, -0.3],
  "zone-6": [0.4, -0.1, -0.3],
};
