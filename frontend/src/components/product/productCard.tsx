import { Card, Image, Text } from "@mantine/core";
import type { Product } from "../../types/product";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card>
            <Card.Section>
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    h={300}
                    fallbackSrc="https://placehold.co/400x300?text=No+Image"
                />
            </Card.Section>

            <Text fw={500} mt="sm">
                {product.name}
            </Text>

            <Text fw={600}>
                NPR {product.price.toLocaleString()}
            </Text>
        </Card>
    );
}