
import { useState } from "react";
import {
    Box,
    Image,
    Stack,
    SimpleGrid,
    UnstyledButton,
    Center,
    Text,
} from "@mantine/core";

type Props = {
    images: string[];
    alt: string;
};

export default function Gallery({ images, alt }: Props) {
    const [active, setActive] = useState(0);

    return (
        <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
            {/* Main image */}
            <Box
                w="100%"
                style={{
                    overflow: "hidden",
                    borderRadius: "var(--mantine-radius-md)",
                    border: "1px solid var(--mantine-color-default-border)",
                }}
            >
                {images.length > 0 ? (
                    <Image
                        src={images[active]}
                        alt={alt}
                        h={500}
                        fit="contain"
                        fallbackSrc="https://placehold.co/600x500?text=No+Image"
                    />
                ) : (
                    <Center h={500} bg="gray.1">
                        <Text c="dimmed" size="sm">
                            No image available
                        </Text>
                    </Center>
                )}
            </Box>

            {/* Image thumbnails */}
            {images.length > 1 && (
                <SimpleGrid cols={4} spacing="xs">
                    {images.map((src, index) => (
                        <UnstyledButton
                            key={`${src}-${index}`}
                            onClick={() => setActive(index)}
                            aria-label={`Show image ${index + 1}`}
                            style={{
                                overflow: "hidden",
                                borderRadius: "var(--mantine-radius-sm)",
                                border:
                                    index === active
                                        ? "2px solid var(--mantine-color-dark-6)"
                                        : "2px solid transparent",
                            }}
                        >
                            <Image
                                src={src}
                                alt=""
                                h={100}
                                fit="cover"
                            />
                        </UnstyledButton>
                    ))}
                </SimpleGrid>
            )}
        </Stack>
    );
}
