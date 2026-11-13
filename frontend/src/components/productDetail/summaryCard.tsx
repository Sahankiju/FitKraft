
import {
    Card,
    Stack,
    Group,
    Text,
    Title,
    Divider,
    Select,
    Button,
    Anchor,
} from "@mantine/core";

import { Link } from "react-router-dom";
import type { Profile } from "./productData";

type PriceLine = {
    label: string;
    amount: number;
};

type Props = {
    total: number;
    basePrice: number;
    extras: PriceLine[];
    readyInDays: number;
    profiles: Profile[];
    profileId: string;
    onProfile: (id: string) => void;
    onAdd: () => void;
};

const npr = (amount: number) =>
    `NPR ${amount.toLocaleString("en-IN")}`;

export default function SummaryCard({
    total,
    basePrice,
    extras,
    readyInDays,
    profiles,
    profileId,
    onProfile,
    onAdd,
}: Props) {
    const options = profiles.map((profile) => ({
        value: profile.id,
        label: `${profile.name} · ${profile.chest}" chest`,
    }));

    return (
        <Card withBorder radius="md" padding="lg">
            <Stack gap="lg">
                {/* Total and delivery estimate */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                        <Text size="sm" c="dimmed">
                            Total
                        </Text>

                        <Title order={3}>
                            {npr(total)}
                        </Title>
                    </Stack>

                    <Stack gap={4} align="flex-end">
                        <Text size="sm" c="dimmed">
                            Ready in about
                        </Text>

                        <Text fw={600}>
                            {readyInDays} days
                        </Text>
                    </Stack>
                </Group>

                <Divider />

                {/* Price breakdown */}
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                            Base price
                        </Text>

                        <Text size="sm" fw={500}>
                            {npr(basePrice)}
                        </Text>
                    </Group>

                    {extras.map((line) => (
                        <Group key={line.label} justify="space-between">
                            <Text size="sm" c="dimmed">
                                {line.label}
                            </Text>

                            <Text size="sm" fw={500}>
                                + {npr(line.amount)}
                            </Text>
                        </Group>
                    ))}
                </Stack>

                <Divider />

                {/* Measurement profile */}
                <Select
                    label="Measuring for"
                    data={options}
                    value={profileId}
                    onChange={(value) => {
                        if (value) onProfile(value);
                    }}
                    allowDeselect={false}
                />

                {/* Add to cart */}
                <Button
                    fullWidth
                    size="lg"
                    onClick={onAdd}
                >
                    Add to cart
                </Button>

                {/* Footer */}
                <Text size="xs" c="dimmed" ta="center">
                    Free alterations in 7 days
                    {" · "}
                    <Anchor
                        component={Link}
                        to="/measurements"
                        size="xs"
                    >
                        Edit measurements
                    </Anchor>
                </Text>
            </Stack>
        </Card>
    );
}
