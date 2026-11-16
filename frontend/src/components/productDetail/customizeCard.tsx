
import {
    Card,
    Stack,
    Title,
    Text,
    Group,
    Button,
    Textarea,
    Divider,
} from "@mantine/core";

import type { OptionGroup } from "./productData";

type Props = {
    groups: OptionGroup[];
    selected: Record<string, string>;
    onSelect: (groupId: string, optionId: string) => void;
    notes: string;
    onNotes: (value: string) => void;
};

const formatExtra = (amount: number) =>
    `+NPR ${amount.toLocaleString("en-IN")}`;

export default function CustomizeCard({
    groups,
    selected,
    onSelect,
    notes,
    onNotes,
}: Props) {
    return (
        <Card withBorder radius="md" padding="lg">
            <Stack gap="lg">
                <Title order={3}>
                    Customize your garment
                </Title>

                {groups.map((group) => (
                    <Stack key={group.id} gap="sm">
                        <Text fw={600}>
                            {group.name}
                        </Text>

                        <Group gap="xs">
                            {group.options.map((option) => {
                                const isActive =
                                    selected[group.id] === option.id;

                                return (
                                    <Button
                                        key={option.id}
                                        variant={isActive ? "filled" : "outline"}
                                        color={isActive ? "var(--brand)" : "var(--muted)"}
                                        radius="xl"
                                        size="sm"
                                        styles={{
                                            root: {
                                                backgroundColor: isActive ? undefined : "var(--bg)",
                                            },
                                        }}
                                        onClick={() => onSelect(group.id, option.id)}
                                    >
                                        <Stack gap={0} align="center">
                                            <Text size="sm">
                                                {option.name}
                                            </Text>

                                            {option.priceModifier > 0 && (
                                                <Text size="xs">
                                                    {formatExtra(option.priceModifier)}
                                                </Text>
                                            )}
                                        </Stack>
                                    </Button>
                                );
                            })}
                        </Group>
                    </Stack>
                ))}

                <Divider />

                <Textarea
                    classNames={{
                        input:"inputField"
                    }}
                    label="Special notes"
                    placeholder="Anything the tailor should know..."
                    value={notes}
                    onChange={(event) =>
                        onNotes(event.currentTarget.value)
                    }
                    maxLength={500}
                    minRows={2}
                    autosize
                />
            </Stack>
        </Card>
    );
}
