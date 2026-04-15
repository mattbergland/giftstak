/**
 * Demo basket data for the reveal experience.
 * Edit this file to change the basket content shown in the demo.
 */

export interface BasketZone {
  id: string;
  number: number;
  category: string;
  itemName: string;
  brand: string;
  rationale: string;
  sourceRegion: string;
  panelPosition: PanelPosition;
}

export type PanelPosition =
  | "left-top"
  | "right-top"
  | "left-mid"
  | "right-mid"
  | "left-bottom"
  | "right-bottom";

export interface BasketData {
  basketName: string;
  description: string;
  zones: BasketZone[];
}

export const demoBasket: BasketData = {
  basketName: "Urban SF Collection",
  description:
    "A bold, city-driven board with sharp contrasts, premium local ingredients, and a modern West Coast finish.",
  zones: [
    {
      id: "zone-1",
      number: 1,
      category: "Cheese",
      itemName: "Toma",
      brand: "Point Reyes Farmstead",
      rationale:
        "Creamy and approachable, selected to anchor the richer cured meats and preserves.",
      sourceRegion: "Marin County",
      panelPosition: "left-top",
    },
    {
      id: "zone-2",
      number: 2,
      category: "Cured Meat",
      itemName: "Soppressata",
      brand: "Fatted Calf",
      rationale:
        "Adds bold, savory depth and brings a city-market energy to the basket.",
      sourceRegion: "San Francisco",
      panelPosition: "right-top",
    },
    {
      id: "zone-3",
      number: 3,
      category: "Crackers",
      itemName: "Rosemary Flatbread",
      brand: "Rustic Bakery",
      rationale:
        "A crisp, aromatic base that balances the softer textures in the box.",
      sourceRegion: "Sonoma",
      panelPosition: "left-mid",
    },
    {
      id: "zone-4",
      number: 4,
      category: "Preserve",
      itemName: "Blackberry Jam",
      brand: "June Taylor",
      rationale:
        "Brings brightness and fruit-forward contrast against the saltier elements.",
      sourceRegion: "Oakland",
      panelPosition: "right-mid",
    },
    {
      id: "zone-5",
      number: 5,
      category: "Olives",
      itemName: "Olive Medley",
      brand: "McEvoy Ranch",
      rationale:
        "A briny accent that sharpens and lifts the overall tasting experience.",
      sourceRegion: "Marin County",
      panelPosition: "left-bottom",
    },
    {
      id: "zone-6",
      number: 6,
      category: "Sweet Finish",
      itemName: "Dark Chocolate Squares",
      brand: "Dandelion Chocolate",
      rationale:
        "Gives the basket a satisfying final note with urban SF character.",
      sourceRegion: "San Francisco",
      panelPosition: "right-bottom",
    },
  ],
};

/** Second demo basket to show reusability of the reveal system */
export const demoBasket2: BasketData = {
  basketName: "Napa Valley Harvest",
  description:
    "An elegant wine-country selection featuring artisan producers from the heart of Napa and Sonoma.",
  zones: [
    {
      id: "zone-1",
      number: 1,
      category: "Cheese",
      itemName: "Mt. Tam Triple Cream",
      brand: "Cowgirl Creamery",
      rationale:
        "Lush and buttery, this cheese sets a decadent foundation for the collection.",
      sourceRegion: "Point Reyes",
      panelPosition: "left-top",
    },
    {
      id: "zone-2",
      number: 2,
      category: "Charcuterie",
      itemName: "Duck Prosciutto",
      brand: "La Quercia",
      rationale:
        "Delicate and refined, pairing beautifully with the wine-country theme.",
      sourceRegion: "Napa",
      panelPosition: "right-top",
    },
    {
      id: "zone-3",
      number: 3,
      category: "Crackers",
      itemName: "Seeded Crisps",
      brand: "Firebrand Artisan Breads",
      rationale:
        "Hearty and aromatic, providing texture contrast to the creamy elements.",
      sourceRegion: "Oakland",
      panelPosition: "left-mid",
    },
    {
      id: "zone-4",
      number: 4,
      category: "Condiment",
      itemName: "Fig Mostarda",
      brand: "Bella Cucina",
      rationale:
        "Sweet-spicy complexity that elevates each pairing on the board.",
      sourceRegion: "Sonoma",
      panelPosition: "right-mid",
    },
    {
      id: "zone-5",
      number: 5,
      category: "Nuts",
      itemName: "Marcona Almonds",
      brand: "Mariani",
      rationale:
        "Buttery crunch that adds a satisfying snack element between bites.",
      sourceRegion: "Sacramento Valley",
      panelPosition: "left-bottom",
    },
    {
      id: "zone-6",
      number: 6,
      category: "Sweet Finish",
      itemName: "Lavender Honey",
      brand: "Marshall's Farm",
      rationale:
        "Floral and golden, a perfect drizzle to close the tasting journey.",
      sourceRegion: "Napa Valley",
      panelPosition: "right-bottom",
    },
  ],
};
