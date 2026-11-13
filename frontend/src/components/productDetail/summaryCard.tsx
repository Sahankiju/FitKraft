
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
        <Card withBorder radius="md" padding="md">
            <Stack gap="sm">
                {/* Total and delivery estimate */}
                <Group justify="space-between" align="center">
                    <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                            Total
                        </Text>

                        <Title order={4}>
                            {npr(total)}
                        </Title>
                    </Stack>

                    <Stack gap={2} align="flex-end">
                        <Text size="xs" c="dimmed">
                            Ready in about
                        </Text>

                        <Text size="sm" fw={600}>
                            {readyInDays} days
                        </Text>
                    </Stack>
                </Group>

                <Divider />

                {/* Price breakdown */}
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            Base price
                        </Text>

                        <Text size="xs" fw={500}>
                            {npr(basePrice)}
                        </Text>
                    </Group>

                    {extras.map((line) => (
                        <Group key={line.label} justify="space-between">
                            <Text size="xs" c="dimmed">
                                {line.label}
                            </Text>

                            <Text size="xs" fw={500}>
                                + {npr(line.amount)}
                            </Text>
                        </Group>
                    ))}
                </Stack>

                <Divider />

                {/* Measurement profile */}
                <Select
                    size="sm"
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
                    size="md"
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
