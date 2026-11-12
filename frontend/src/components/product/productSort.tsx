
import { Select } from "@mantine/core";
import type { Product } from "../../types/product";

export type SortOption =
    | "featured"
    | "newest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";

export function sortProducts(
    products: Product[],
    sortBy: SortOption | null
): Product[] {
    const sorted = [...products];

    switch (sortBy) {
        case "featured":
            return sorted.sort(
                (a, b) => Number(b.featured) - Number(a.featured)
            );

        case "newest":
            return sorted.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

        case "price_asc":
            return sorted.sort((a, b) => a.price - b.price);

        case "price_desc":
            return sorted.sort((a, b) => b.price - a.price);

        case "name_asc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));

        case "name_desc":
            return sorted.sort((a, b) => b.name.localeCompare(a.name));

        default:
            return sorted;
    }
}

interface ProductSortProps {
    value: SortOption;
    onChange: (value: SortOption | null) => void;
}

export default function ProductSort({
    value,
    onChange,
}: ProductSortProps) {
    return (
        <Select
            placeholder="Sort by"
            value={value}
            onChange={(value) => onChange(value as SortOption | null)}
            data={[
                { value: "featured", label: "Featured" },
                { value: "newest", label: "Newest" },
                { value: "price_asc", label: "Price: Low to High" },
                { value: "price_desc", label: "Price: High to Low" },
                { value: "name_asc", label: "Name: A to Z" },
                { value: "name_desc", label: "Name: Z to A" },
            ]}
            w={200}
            clearable
        />
    );
}
