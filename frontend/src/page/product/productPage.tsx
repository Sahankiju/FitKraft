import { useSearchParams, useLoaderData } from "react-router-dom";
import { useMemo, useState } from "react";

import {
    Title,
    Text,
    SimpleGrid,
    Center,
    Flex,
    ScrollArea,
    Box,
} from "@mantine/core";

import type { Product } from "../../types/product";

import ProductCard from "../../components/product/productCard";
import ProductFilter from "../../components/product/productFilter";
import ProductSort, {
    sortProducts,
    type SortOption,
} from "../../components/product/productSort";
import { filterProducts } from "./productFilters";
import classes from "./productPage.module.css";
import { categories } from "../../data/categories";

export {productPageLoader} from "./productPage.Loader"

export default function ProductPage() {
    const products = useLoaderData() as Product[];
    const [searchParams] = useSearchParams();

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const name = searchParams.get("category");
        const match = categories.find(
            (category) => category.name.toLowerCase() === name?.toLowerCase()
        );
        return match ? [match.id] : [];
    });

    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

    // Sorting state
    const [sortBy, setSortBy] = useState<SortOption | null>(() => {
        const sort = searchParams.get("sort");
        return (sort as SortOption) || "newest";
    });

    // Handle category selection
    const handleCategoryChange = (id: string, checked: boolean) => {
        setSelectedCategories((prev) =>
            checked ? [...prev, id] : prev.filter((categoryId) => categoryId !== id)
        );
    };

    // Handle price selection
    const handlePriceChange = (range: string, checked: boolean) => {
        setSelectedPriceRanges((prev) =>
            checked ? [...prev, range] : prev.filter((priceRange) => priceRange !== range)
        );
    };

    // Filter and sort products
    const displayedProducts = useMemo(() => {
        const filtered = filterProducts(products, selectedCategories, selectedPriceRanges);
        return sortProducts(filtered, sortBy);
    }, [products, selectedCategories, selectedPriceRanges, sortBy]);

    return (
        <Box py="xl" w="85%" mx="auto">
            <Title order={1}>All designs</Title>

            <Text c="dimmed" mt={4} mb="xl">
                {displayedProducts.length} products
            </Text>

            <Flex gap="xl" align="stretch" className={classes.productLayout}>
                <div className={classes.filterSection}>
                    <ScrollArea h="100%" type="auto">
                        <ProductFilter
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                            selectedPriceRanges={selectedPriceRanges}
                            onPriceChange={handlePriceChange}
                        />
                    </ScrollArea>
                </div>

                <div className={classes.productSection}>
                    <ScrollArea h="100%" type="auto">
                        <Flex justify="flex-end" mb="lg">
                            <ProductSort value={sortBy ?? "newest"} onChange={setSortBy} />
                        </Flex>

                        {displayedProducts.length === 0 ? (
                            <Center py="xl">
                                <Text c="dimmed">No products found.</Text>
                            </Center>
                        ) : (
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                                {displayedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </SimpleGrid>
                        )}
                    </ScrollArea>
                </div>
            </Flex>
        </Box>
    );
}