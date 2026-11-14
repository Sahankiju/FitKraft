
import { Group, Stack, Text } from "@mantine/core";
import classes from "./measurement.module.css";

const TIPS = [
    "Use a soft measuring tape",
    "Measure over undergarments",
    "Keep the tape snug, not tight",
    "Stand upright and relaxed",
];

export default function MeasureGuide() {
    return (
        <Stack className={classes.guide} gap="sm">
            <Text fw={600} className={classes.guideTitle}>
                How to measure
            </Text>

            <Stack gap="xs" className={classes.guideList}>
                {TIPS.map((tip) => (
                    <Group key={tip} gap="xs" wrap="nowrap" align="flex-start">
                        <Text c="dimmed" fw={600}>→</Text>
                        <Text size="sm">{tip}</Text>
                    </Group>
                ))}
            </Stack>
        </Stack>
    );
}
