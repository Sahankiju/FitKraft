import { useState, useEffect } from "react";
import axios from 'axios';
import { SimpleGrid, Card, Text, Image } from "@mantine/core";
import type { Product } from "../../types/product.ts";

export default function BestSeller() {

    const [bestSellers, setBestSellers] = useState<Product[]>([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL}/api/v1/products?featured=true&limit=3`);
                const data = response.data;
                setBestSellers(data);
            } catch (error) {
                console.error('Error fetching best sellers:', error);
            }
        };

        fetchBestSellers();
    }, []);

    return (
        <div>
            <SimpleGrid cols={4}>
                {bestSellers.map((product) => (
                    <Card key={product.id}>
                        <Card.Section>
                            <Image src={product.thumbnail} alt={product.name} />
                        </Card.Section>
                        <Text>{product.name}</Text>
                        <Text>${product.price.toFixed(2)}</Text>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
}