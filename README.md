# Giftstak

Curated gift baskets with a cinematic interactive reveal experience. An AI-generated gift basket is presented through a 3D box model that opens and reveals compartments one-by-one, with animated callout lines and ingredient detail panels.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the homepage. Click **"See a Demo Reveal"** to experience the cinematic reveal.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with hero, form, and demo CTA
│   ├── reveal/page.tsx       # Cinematic reveal experience
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles, paper grain, animations
├── components/
│   ├── BasketGeneratorForm   # Location/vibe/occasion/budget form
│   ├── BasketRevealScene     # React Three Fiber 3D scene
│   ├── RevealSequenceController  # Timed reveal sequence manager
│   ├── CalloutOverlay        # SVG lines connecting 3D anchors to cards
│   ├── IngredientCalloutCard # Individual ingredient detail card
│   ├── ResultTabs            # Overview/Ingredients/Sources/Assembly/Concierge
│   ├── ReplayRevealButton    # Replay the reveal sequence
│   └── SkipButton            # Skip to final state
└── lib/
    ├── basket-data.ts        # Demo basket JSON data
    ├── anchor-config.ts      # 3D anchor positions per zone
    ├── panel-positions.ts    # Screen-space panel positions for cards
    ├── animation-config.ts   # Timing, camera, and animation constants
    └── reveal-store.ts       # Zustand state for reveal sequence
```

## Where to Place the GLB Model

Place your gift box GLB model at:

```
public/models/gift-box.glb
```

The scene will automatically load it. If the file is not present, a built-in fallback box with lid, dividers, and ribbon will render instead.

## How to Edit Basket Data

Edit `src/lib/basket-data.ts` to change the demo basket content. The data structure:

```ts
{
  basketName: "Urban SF Collection",
  description: "...",
  zones: [
    {
      id: "zone-1",
      number: 1,
      category: "Cheese",
      itemName: "Toma",
      brand: "Point Reyes Farmstead",
      rationale: "...",
      sourceRegion: "Marin County",
      panelPosition: "left-top"   // where the card appears on screen
    },
    // ... more zones
  ]
}
```

A second demo basket (`demoBasket2`) is also included to demonstrate reusability.

## How to Edit Anchor Positions

Edit `src/lib/anchor-config.ts` to tune where callout lines originate on the 3D model:

```ts
export const basketAnchors = {
  "zone-1": [-0.4, 0.15, 0.3],   // [x, y, z] in 3D space
  "zone-2": [0.4, 0.15, 0.3],
  // ...
};
```

Coordinate system:
- **x**: left (negative) / right (positive)
- **y**: down (negative) / up (positive)
- **z**: back (negative) / front (positive)

## How to Edit Panel Positions

Edit `src/lib/panel-positions.ts` to change where callout cards appear on screen:

```ts
export const panelPositions = {
  "left-top": { top: "8%", left: "2%", side: "left" },
  "right-top": { top: "8%", left: "72%", side: "right" },
  // ...
};
```

## How to Tune Reveal Timing

Edit `src/lib/animation-config.ts` to adjust the pacing:

```ts
export const ANIMATION_CONFIG = {
  assemblingDuration: 2000,       // "Curating..." overlay
  boxSettleDuration: 1500,        // Box appears and settles
  lidOpenDuration: 1800,          // Lid opening animation
  postLidPause: 800,              // Pause after lid opens
  compartmentRevealDuration: 1400, // Per-compartment reveal
  compartmentPause: 400,          // Pause between compartments
  // ...
};
```

Total reveal: approximately 12 seconds. Camera positions and orbit constraints are also configurable in this file.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **React Three Fiber** + **@react-three/drei** for 3D
- **Framer Motion** for UI animations
- **Zustand** for lightweight state management
- SVG overlay layer for animated callout lines

## Design Direction

- Warm parchment / off-white background with subtle paper grain
- Elegant serif headlines (Playfair Display) + clean sans body (Inter)
- Fine gray architectural lines
- Luxury editorial feel with generous whitespace
- Premium, minimal, not sci-fi
