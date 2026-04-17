/**
 * Gift basket data for the Giftstak product.
 *
 * Each basket is localized to a specific city/region with artisan producers
 * from that area. Add new baskets by following the same structure.
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
  /** Path to the crayon-styled product image */
  imageUrl: string;
}

export type PanelPosition =
  | "left-top"
  | "right-top"
  | "left-mid"
  | "right-mid"
  | "left-bottom"
  | "right-bottom";

export interface BasketData {
  slug: string;
  basketName: string;
  city: string;
  region: string;
  description: string;
  shortDescription: string;
  price: number;
  imageEmoji: string;
  zones: BasketZone[];
}

/** All available baskets — keyed by slug for easy lookup */
export const baskets: Record<string, BasketData> = {
  "urban-sf": {
    slug: "urban-sf",
    basketName: "Urban SF Collection",
    city: "San Francisco",
    region: "Bay Area, CA",
    description:
      "A bold, city-driven board with sharp contrasts, premium local ingredients, and a modern West Coast finish.",
    shortDescription:
      "Bold city flavors from SF\u2019s best artisan producers.",
    price: 95,
    imageEmoji: "\uD83C\uDF09",
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
        imageUrl: "/images/products/crayon/urban-sf-zone-1.jpg",
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
        imageUrl: "/images/products/crayon/urban-sf-zone-2.jpg",
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
        imageUrl: "/images/products/crayon/urban-sf-zone-3.jpg",
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
        imageUrl: "/images/products/crayon/urban-sf-zone-4.jpg",
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
        imageUrl: "/images/products/crayon/urban-sf-zone-5.jpg",
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
        imageUrl: "/images/products/crayon/urban-sf-zone-6.jpg",
      },
    ],
  },

  "napa-harvest": {
    slug: "napa-harvest",
    basketName: "Napa Valley Harvest",
    city: "Napa",
    region: "Wine Country, CA",
    description:
      "An elegant wine-country selection featuring artisan producers from the heart of Napa and Sonoma.",
    shortDescription:
      "Elegant wine-country pairings from Napa & Sonoma.",
    price: 125,
    imageEmoji: "\uD83C\uDF47",
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
        imageUrl: "/images/products/crayon/napa-zone-1.jpg",
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
        imageUrl: "/images/products/crayon/napa-zone-2.jpg",
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
        imageUrl: "/images/products/crayon/napa-zone-3.jpg",
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
        imageUrl: "/images/products/crayon/napa-zone-4.jpg",
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
        imageUrl: "/images/products/crayon/napa-zone-5.jpg",
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
        imageUrl: "/images/products/crayon/napa-zone-6.jpg",
      },
    ],
  },

  "la-coast": {
    slug: "la-coast",
    basketName: "LA Coast Collection",
    city: "Los Angeles",
    region: "Southern California",
    description:
      "A sun-soaked selection of California\u2019s best \u2014 bright citrus, fresh produce, and laid-back luxury from LA\u2019s artisan scene.",
    shortDescription:
      "Sun-soaked flavors from LA\u2019s artisan producers.",
    price: 110,
    imageEmoji: "\uD83C\uDF34",
    zones: [
      {
        id: "zone-1",
        number: 1,
        category: "Cheese",
        itemName: "Bloomsdale",
        brand: "Drake Family Farms",
        rationale:
          "A fresh, tangy goat cheese that captures the brightness of Southern California.",
        sourceRegion: "Santa Paula",
        panelPosition: "left-top",
        imageUrl: "/images/products/crayon/la-zone-1.jpg",
      },
      {
        id: "zone-2",
        number: 2,
        category: "Charcuterie",
        itemName: "Nduja Spread",
        brand: "Olympia Provisions",
        rationale:
          "A spicy, spreadable salami that brings bold heat to the board.",
        sourceRegion: "Downtown LA",
        panelPosition: "right-top",
        imageUrl: "/images/products/crayon/la-zone-2.jpg",
      },
      {
        id: "zone-3",
        number: 3,
        category: "Crackers",
        itemName: "Olive Oil Crackers",
        brand: "Rustic Bakery",
        rationale:
          "Light and crisp with a clean olive oil finish, ideal for pairing.",
        sourceRegion: "Malibu",
        panelPosition: "left-mid",
        imageUrl: "/images/products/crayon/la-zone-3.jpg",
      },
      {
        id: "zone-4",
        number: 4,
        category: "Preserve",
        itemName: "Meyer Lemon Marmalade",
        brand: "Sqirl",
        rationale:
          "Bright, citrus-forward preserves that define the LA food scene.",
        sourceRegion: "Silver Lake",
        panelPosition: "right-mid",
        imageUrl: "/images/products/crayon/la-zone-4.jpg",
      },
      {
        id: "zone-5",
        number: 5,
        category: "Nuts",
        itemName: "Smoked Almonds",
        brand: "Fastachi",
        rationale:
          "Slow-roasted with applewood smoke for a rich, savory crunch.",
        sourceRegion: "Pasadena",
        panelPosition: "left-bottom",
        imageUrl: "/images/products/crayon/la-zone-5.jpg",
      },
      {
        id: "zone-6",
        number: 6,
        category: "Sweet Finish",
        itemName: "Sea Salt Caramels",
        brand: "Compartes",
        rationale:
          "Handcrafted LA chocolates with a buttery, melt-in-your-mouth finish.",
        sourceRegion: "West Hollywood",
        panelPosition: "right-bottom",
        imageUrl: "/images/products/crayon/la-zone-6.jpg",
      },
    ],
  },

  "portland-provisions": {
    slug: "portland-provisions",
    basketName: "Portland Provisions",
    city: "Portland",
    region: "Pacific Northwest",
    description:
      "A thoughtfully crafted Pacific Northwest board with foraged flavors, small-batch artisans, and a distinctly Portland spirit.",
    shortDescription:
      "Foraged flavors and small-batch PNW artisans.",
    price: 89,
    imageEmoji: "\uD83C\uDF32",
    zones: [
      {
        id: "zone-1",
        number: 1,
        category: "Cheese",
        itemName: "Rogue River Blue",
        brand: "Rogue Creamery",
        rationale:
          "A world-class blue cheese wrapped in grape leaves \u2014 earthy and complex.",
        sourceRegion: "Central Point, OR",
        panelPosition: "left-top",
        imageUrl: "/images/products/crayon/portland-zone-1.jpg",
      },
      {
        id: "zone-2",
        number: 2,
        category: "Cured Meat",
        itemName: "Peppered Salami",
        brand: "Olympia Provisions",
        rationale:
          "A Portland staple \u2014 bold pepper heat balanced by rich pork flavor.",
        sourceRegion: "Portland",
        panelPosition: "right-top",
        imageUrl: "/images/products/crayon/portland-zone-2.jpg",
      },
      {
        id: "zone-3",
        number: 3,
        category: "Crackers",
        itemName: "Rye Crispbread",
        brand: "Broder",
        rationale:
          "Scandinavian-inspired crackers that nod to Portland\u2019s Nordic food culture.",
        sourceRegion: "Portland",
        panelPosition: "left-mid",
        imageUrl: "/images/products/crayon/portland-zone-3.jpg",
      },
      {
        id: "zone-4",
        number: 4,
        category: "Preserve",
        itemName: "Marionberry Preserves",
        brand: "Jacobsen Salt Co.",
        rationale:
          "Oregon\u2019s signature berry, preserved at peak ripeness with minimal sugar.",
        sourceRegion: "Oregon Coast",
        panelPosition: "right-mid",
        imageUrl: "/images/products/crayon/portland-zone-4.jpg",
      },
      {
        id: "zone-5",
        number: 5,
        category: "Pickles",
        itemName: "Bread & Butter Pickles",
        brand: "Picklopolis",
        rationale:
          "Tangy-sweet pickles that cut through the richness of cheese and meat.",
        sourceRegion: "Portland",
        panelPosition: "left-bottom",
        imageUrl: "/images/products/crayon/portland-zone-5.jpg",
      },
      {
        id: "zone-6",
        number: 6,
        category: "Sweet Finish",
        itemName: "Drinking Chocolate",
        brand: "Woodblock Chocolate",
        rationale:
          "Single-origin, stone-ground chocolate with deep, earthy notes.",
        sourceRegion: "Portland",
        panelPosition: "right-bottom",
        imageUrl: "/images/products/crayon/portland-zone-6.jpg",
      },
    ],
  },
};

/** Helper: get basket by slug, defaulting to SF */
export function getBasketBySlug(slug: string | null): BasketData {
  if (slug && baskets[slug]) {
    return baskets[slug];
  }
  return baskets["urban-sf"];
}

/** All baskets as an array for listing */
export const basketList: BasketData[] = Object.values(baskets);
