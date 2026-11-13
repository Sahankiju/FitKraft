/* Types used by ProductDetail, CustomizeCard and SummaryCard */
export type Option = { id: string; name: string; priceModifier: number };
export type OptionGroup = { id: string; name: string; options: Option[] };
export type Profile = { id: string; name: string; chest: number };

/* Fake options, copied from the design. Replace with backend data later. */
export const GROUPS: OptionGroup[] = [
  {
    id: "fabric",
    name: "Fabric",
    options: [
      { id: "cotton", name: "Premium Cotton", priceModifier: 0 },
      { id: "linen", name: "Linen", priceModifier: 200 },
      { id: "silk", name: "Silk", priceModifier: 900 },
      { id: "wool", name: "Wool Blend", priceModifier: 500 },
      { id: "polyester", name: "Polyester Mix", priceModifier: 300 },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { id: "white", name: "White", priceModifier: 0 },
      { id: "charcoal", name: "Charcoal", priceModifier: 0 },
      { id: "navy", name: "Navy", priceModifier: 0 },
      { id: "camel", name: "Camel", priceModifier: 0 },
      { id: "cream", name: "Cream", priceModifier: 0 },
      { id: "olive", name: "Olive", priceModifier: 0 },
    ],
  },
  {
    id: "collar",
    name: "Collar",
    options: [
      { id: "classic", name: "Classic Point", priceModifier: 0 },
      { id: "spread", name: "Spread", priceModifier: 0 },
      { id: "button-down", name: "Button-Down", priceModifier: 0 },
      { id: "mandarin", name: "Mandarin", priceModifier: 0 },
      { id: "club", name: "Club", priceModifier: 0 },
    ],
  },
  {
    id: "sleeve",
    name: "Sleeve",
    options: [
      { id: "full", name: "Full Sleeve", priceModifier: 0 },
      { id: "half", name: "Half Sleeve", priceModifier: 0 },
      { id: "rolled", name: "Rolled ¾", priceModifier: 0 },
      { id: "sleeveless", name: "Sleeveless", priceModifier: 0 },
    ],
  },
  {
    id: "pocket",
    name: "Pocket",
    options: [
      { id: "none", name: "No Pocket", priceModifier: 0 },
      { id: "single", name: "Single Chest", priceModifier: 0 },
      { id: "double", name: "Double Chest", priceModifier: 0 },
      { id: "side", name: "Side Pockets", priceModifier: 0 },
    ],
  },
  {
    id: "buttons",
    name: "Buttons",
    options: [
      { id: "standard", name: "Standard", priceModifier: 0 },
      { id: "pearl", name: "Pearl", priceModifier: 0 },
      { id: "metal", name: "Metal", priceModifier: 0 },
      { id: "contrast", name: "Contrast", priceModifier: 0 },
      { id: "hidden", name: "Hidden", priceModifier: 0 },
    ],
  },
  {
    id: "embroidery",
    name: "Embroidery",
    options: [
      { id: "none", name: "None", priceModifier: 0 },
      { id: "logo", name: "Minimal Logo", priceModifier: 300 },
      { id: "monogram", name: "Chest Monogram", priceModifier: 500 },
      { id: "full", name: "Full Embroidery", priceModifier: 1800 },
    ],
  },
  {
    id: "lining",
    name: "Lining",
    options: [
      { id: "none", name: "No Lining", priceModifier: 0 },
      { id: "half", name: "Half Lining", priceModifier: 600 },
      { id: "full", name: "Full Lining", priceModifier: 1200 },
      { id: "contrast", name: "Contrast Lining", priceModifier: 1500 },
    ],
  },
];

/* One fake measurement profile for the "Measuring for" dropdown */
export const PROFILES: Profile[] = [{ id: "1", name: "Myself", chest: 42 }];