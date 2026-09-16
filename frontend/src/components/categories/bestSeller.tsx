import { useState, useEffect } from "react";
import axios from 'axios';
import { SimpleGrid, Card, Text, Image } from "@mantine/core";

export default function BestSeller() {

    type Product = {
        id: string;
        name: string;
        image: string;
        price: number;
    };

    const [bestSellers, setBestSellers] = useState<Product[]>([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL}/products/bestSellers`);
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
                            <Image src={product.image} alt={product.name} />
                        </Card.Section>
                        <Text>{product.name}</Text>
                        <Text>${product.price.toFixed(2)}</Text>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
}