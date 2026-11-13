
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Center,
    Loader,
    Flex,
    ScrollArea,
} from "@mantine/core";

import type { Product } from "../../types/product";

import ProductCard from "../../components/product/productCard";
import ProductFilter from "../../components/product/productFilter";
import ProductSort, {
    sortProducts,
    type SortOption,
} from "../../components/product/productSort";
import classes from "./productPage.module.css";

// Available categories
const categories = [
    { id: "1", name: "Shirts" },
    { id: "2", name: "Pants" },
    { id: "3", name: "Suits" },
    { id: "4", name: "Blazers" },
    { id: "5", name: "Kurta" },
    { id: "6", name: "Dresses" },
];

export default function ProductPage() {
    // Product data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

    // Sorting state
    const [sortBy, setSortBy] = useState<SortOption | null>("featured");

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>(
                    `${import.meta.env.VITE_API_URL}/api/v1/products`
                );

                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle category selection
    const handleCategoryChange = (id: string, checked: boolean) => {
        setSelectedCategories((prev) => checked
                ? [...prev, id]
                : prev.filter((categoryId) => categoryId !== id)
        );
    };

    // Handle price selection
    const handlePriceChange = (range: string, checked: boolean) => {
        setSelectedPriceRanges((prev) => checked
                ? [...prev, range]
                : prev.filter((priceRange) => priceRange !== range)
        );
    };

    // Filter and sort products
    const displayedProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            // Category filtering
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(product.category_id);

            // Price filtering
            const matchesPrice =
                selectedPriceRanges.length === 0 ||
                selectedPriceRanges.some((range) => {
                    switch (range) {
                        case "under-3000":
                            return product.price < 3000;

                        case "3000-7000":
                            return product.price >= 3000 && product.price < 7000;

                        case "7000-15000":
                            return product.price >= 7000 && product.price < 15000;

                        case "15000-plus":
                            return product.price >= 15000;

                        default:
                            return false;
                    }
                });

            return matchesCategory && matchesPrice;
        });

        return sortProducts(filtered, sortBy);
    }, [products, selectedCategories, selectedPriceRanges, sortBy]);

     return (
        <Container size="xl" py="xl">

            {/* Page heading */}
            <Title order={1}>All designs</Title>

            <Text c="dimmed" mt={4} mb="xl">
                {displayedProducts.length} products
            </Text>

            <Flex
                gap="xl"
                align="stretch"
                className={classes.productLayout}
            >
                {/* Filter sidebar */}
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

                {/* Product section */}
                <div className={classes.productSection}>
                    <ScrollArea h="100%" type="auto">

                        {/* Sorting */}
                        <Flex justify="flex-end" mb="lg">
                            <ProductSort
                                value={sortBy ?? "featured"}
                                onChange={setSortBy}
                            />
                        </Flex>

                        {/* Loading / Empty / Products */}
                        {loading ? (
                            <Center py="xl">
                                <Loader />
                            </Center>
                        ) : displayedProducts.length === 0 ? (
                            <Center py="xl">
                                <Text c="dimmed">
                                    No products found.
                                </Text>
                            </Center>
                        ) : (
                            <SimpleGrid
                                cols={{ base: 1, sm: 2, md: 3 }}
                                spacing="lg"
                            >
                                {displayedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </SimpleGrid>
                        )}

                    </ScrollArea>
                </div>
            </Flex>
        </Container>
    );
}
