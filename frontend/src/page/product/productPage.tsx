
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
    Box,
    ScrollArea,
} from "@mantine/core";

import type { Product } from "../../types/product";
import ProductCard from "../../components/product/productCard";
import ProductFilter from "../../components/product/productFilter";
import ProductSort, {
    sortProducts,
    type SortOption,
} from "../../components/product/productSort";

const categories = [
    { id: "1", name: "Shirts" },
    { id: "2", name: "Pants" },
    { id: "3", name: "Suits" },
    { id: "4", name: "Blazers" },
    { id: "5", name: "Kurta" },
    { id: "6", name: "Dresses" },
];

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<SortOption | null>("featured");

    const sortedProducts = useMemo(() => {
        return sortProducts(products, sortBy);
    }, [products, sortBy]);

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

    return (
        <ScrollArea w="100%" h="100%">
            <Container size="xl" py="xl">
                <Title order={1}>All designs</Title>

                <Text c="dimmed" mt={4} mb="xl">
                    {products.length} products
                </Text>

                <Flex gap="xl" align="flex-start">
                    {/* Filters */}
                    <Box w={260} style={{ flexShrink: 0 }}>
                        <ProductFilter
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryChange={(id, checked) => {
                                setSelectedCategories((prev) =>
                                    checked
                                        ? [...prev, id]
                                        : prev.filter((item) => item !== id)
                                );
                            }}
                            selectedPriceRanges={selectedPriceRanges}
                            onPriceChange={(range, checked) => {
                                setSelectedPriceRanges((prev) =>
                                    checked
                                        ? [...prev, range]
                                        : prev.filter((item) => item !== range)
                                );
                            }}
                        />
                    </Box>

                    {/* Products */}
                    <Box flex={1}>
                        <Flex justify="flex-end" mb="lg">
                            <ProductSort
                                value={sortBy ?? "featured"}
                                onChange={setSortBy}
                            />
                        </Flex>

                        {loading ? (
                            <Center py="xl">
                                <Loader />
                            </Center>
                        ) : sortedProducts.length === 0 ? (
                            <Center py="xl">
                                <Text>No products found.</Text>
                            </Center>
                        ) : (
                            <SimpleGrid
                                cols={{ base: 1, sm: 2, md: 3 }}
                                spacing="lg"
                            >
                                {sortedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                </Flex>
            </Container>
        </ScrollArea>
    );
}
