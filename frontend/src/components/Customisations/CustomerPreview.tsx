import { Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { formatPrice, ruleText, type ProductGroup } from "./Api";

// `groups` comes straight from GET /products/:id/customisations, which only
// returns active options, so this is exactly what shoppers will see.
export function CustomerPreview({ groups }: { groups: ProductGroup[] }) {
  return (
    <Paper withBorder radius="md" p="md" style={{ position: "sticky", top: 16 }}>
      <Text fw={600} mb="sm">What customers see</Text>

      {groups.length === 0 ? (
        <Text size="sm" c="dimmed">Nothing attached yet.</Text>
      ) : (
        <Stack gap="md">
          {groups.map((g) => (
            <Box key={g.id}>
              <Group gap="xs">
                <Text fw={600}>{g.name}</Text>
                {g.required && (
                  <Badge color="red" variant="light" size="xs" tt="none">Required</Badge>
                )}
              </Group>
              <Text size="xs" c="dimmed">{ruleText(g)}</Text>
              <Group gap={6} mt={6}>
                {g.options.length === 0 ? (
                  <Text size="xs" c="dimmed">No active options</Text>
                ) : (
                  g.options.map((o) => (
                    <Badge key={o.id} variant="outline" color="gray" tt="none" fw={500}>
                      {o.name}
                      {o.price_modifier ? ` ${formatPrice(o.price_modifier)}` : ""}
                    </Badge>
                  ))
                )}
              </Group>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
