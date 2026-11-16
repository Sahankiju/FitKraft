import {
    Paper,
    Title,
    Text,
    Checkbox,
    Stack,
    Divider,
} from "@mantine/core";

import { priceRanges } from "../../data/priceRange";

interface Category {
    id: string;
    name: string;
}

interface ProductFilterProps {
    categories: Category[];
    selectedCategories: string[];
    onCategoryChange: (id: string, checked: boolean) => void;
    selectedPriceRanges: string[];
    onPriceChange: (range: string, checked: boolean) => void;
}

export default function ProductFilter({
    categories,
    selectedCategories,
    onCategoryChange,
    selectedPriceRanges,
    onPriceChange,
}: ProductFilterProps) {
    return (
        <Paper withBorder p="lg" radius="lg">
            <Title order={3} mb="lg">
                Filters
            </Title>

            {/* Category filter */}
            <Text size="xs" fw={600} c="dimmed" mb="md">
                CATEGORY
            </Text>

            <Stack gap="sm">
                {categories.map((category) => (
                    <Checkbox
                        classNames={{ input: "inputField" }}
                        key={category.id}
                        label={category.name}
                        checked={selectedCategories.includes(category.id)}
                        onChange={(event) =>
                            onCategoryChange(category.id, event.currentTarget.checked)
                        }
                    />
                ))}
            </Stack>

            <Divider my="lg" />

            {/* Price filter */}
            <Text size="xs" fw={600} c="dimmed" mb="md">
                PRICE
            </Text>

            <Stack gap="sm">
                {priceRanges.map((range) => (
                    <Checkbox
                        classNames={{ input: "inputField" }}
                        key={range.value}
                        label={range.label}
                        checked={selectedPriceRanges.includes(range.value)}
                        onChange={(event) =>
                            onPriceChange(range.value, event.currentTarget.checked)
                        }
                    />
                ))}
            </Stack>
        </Paper>
    );
}