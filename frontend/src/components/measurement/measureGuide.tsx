
import { Group, Stack, Text, Box } from "@mantine/core";

const TIPS = [
    "Use a soft measuring tape",
    "Measure over undergarments",
    "Keep the tape snug, not tight",
    "Stand upright and relaxed",
];

export default function MeasureGuide() {
    return (
        <Box bd="1px solid var(--line)" bdrs="lg" c="var(--muted)" bg="var(--surface)">
            <Stack gap="sm" p="md">
                <Text fw={600} >
                    How to measure
                </Text>

                <Stack gap="xs" >
                    {TIPS.map((tip) => (
                        <Group key={tip} gap="xs" wrap="nowrap" align="flex-start">
                            <Text c="dimmed" fw={400}>→</Text>
                            <Text size="sm">{tip}</Text>
                        </Group>
                    ))}
                </Stack>
            </Stack>
        </Box>
    );
}
