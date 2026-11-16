export type PriceRange = {
    label: string;
    value: string;
    matches: (price: number) => boolean;
};

export const priceRanges: PriceRange[] = [
    { label: "Under NPR 3,000", value: "under-3000", matches: (price) => price < 3000 },
    { label: "NPR 3,000 – 7,000", value: "3000-7000", matches: (price) => price >= 3000 && price < 7000 },
    { label: "NPR 7,000 – 15,000", value: "7000-15000", matches: (price) => price >= 7000 && price < 15000 },
    { label: "NPR 15,000+", value: "15000-plus", matches: (price) => price >= 15000 },
];