import { useState, useEffect } from "react";
import axios from 'axios';
import { SimpleGrid, Card, Text, Image, UnstyledButton } from "@mantine/core";
import type { Product } from "../../types/product.ts";
import classes from "./categories.module.css";
import { useNavigate } from "react-router-dom";

export default function BestSeller() {

    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const navigate = useNavigate();
    const selectFeatured = () => {
        navigate(`/product?sort=featured`);
    };

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
            <SimpleGrid cols={3} spacing="md" mt={{ base: 10, md: 20 }}>
                {bestSellers.map((product) => (
                    <UnstyledButton  className={classes.product} onClick={selectFeatured}>
                        <Card key={product.id} className={classes.productCard}>
                            <Card.Section className={classes.productImg}>
                                <Image src={product.thumbnail} alt={product.name} />
                            </Card.Section>
                            <Text className={classes.productName}>{product.name}</Text>
                            <Text className={classes.productPrice}>NPR {product.price.toLocaleString("en-IN")}</Text>
                        </Card>
                    </UnstyledButton>
                ))}
            </SimpleGrid>
        </div>
    );
}