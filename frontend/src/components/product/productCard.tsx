
import { Card, Image, Text, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import classes from "./product.module.css"

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            className={classes.ProductCard}
            padding="md"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <Card.Section>
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    h={300}
                    fallbackSrc="https://placehold.co/400x300?text=No+Image"
                />
            </Card.Section>

            <Stack gap={4} mt="sm">
                <Text fw={500}>
                    {product.name}
                </Text>

                <Text>
                    NPR {product.price.toLocaleString("en-IN")}
                </Text>
            </Stack>
        </Card>
    );
}
