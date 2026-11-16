import type { Product } from "../../types/product";
import { priceRanges } from "../../data/priceRange";

export function filterProducts(
    products: Product[],
    selectedCategories: string[],
    selectedPriceRanges: string[]
): Product[] {
    return products.filter((product) => {
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category_id);

        const matchesPrice =
            selectedPriceRanges.length === 0 ||
            selectedPriceRanges.some((range) =>
                priceRanges.find((r) => r.value === range)?.matches(product.price) ?? false
            );

        return matchesCategory && matchesPrice;
    });
}