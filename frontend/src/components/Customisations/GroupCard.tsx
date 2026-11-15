import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";
import { formatPrice, ruleText, type Option, type ProductGroup } from "./Api";

interface Props {
  group: ProductGroup;
  reusable: boolean;
  usedBy: string[]; // names of products using this group
  options: Option[]; // all options, including hidden ones when the API allows
  isFirst: boolean;
  isLast: boolean;
  onMove: (dir: -1 | 1) => void;
  onRequired: (value: boolean) => void;
  onEditRules: () => void;
  onDetach: () => void;
  onAddOption: () => void;
  onEditOption: (o: Option) => void;
  onToggleOption: (o: Option) => void;
}

export function GroupCard(p: Props) {
  const { group, reusable, usedBy } = p;
  const shared = reusable && usedBy.length > 1;
  const sorted = [...p.options].sort(
    (a, b) => Number(b.is_active) - Number(a.is_active) || a.name.localeCompare(b.name),
  );

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start" gap="sm">
        <Stack gap={4}>
          <Group gap="xs">
            <Text fw={700} fz="lg">{group.name}</Text>
            <Badge variant="light" color={reusable ? "blue" : "teal"} tt="none">
              {reusable
                ? `Reusable · ${usedBy.length} product${usedBy.length === 1 ? "" : "s"}`
                : "Only this product"}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">{ruleText(group)}</Text>
        </Stack>

        <Group gap="xs">
          <Checkbox
            label="Required"
            checked={group.required}
            onChange={(e) => p.onRequired(e.currentTarget.checked)}
          />
          <Tooltip label="Move up">
            <ActionIcon variant="default" disabled={p.isFirst} onClick={() => p.onMove(-1)} aria-label="Move up">
              ↑
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Move down">
            <ActionIcon variant="default" disabled={p.isLast} onClick={() => p.onMove(1)} aria-label="Move down">
              ↓
            </ActionIcon>
          </Tooltip>
          <Button size="xs" variant="default" onClick={p.onEditRules}>Edit rules</Button>
          <Button size="xs" variant="subtle" color="red" onClick={p.onDetach}>Detach</Button>
        </Group>
      </Group>

      {shared && (
        <Alert color="yellow" variant="light" mt="sm" p="xs">
          Shared with {usedBy.join(", ")}. Changing options or rules here changes them everywhere.
        </Alert>
      )}

      <Stack gap={6} mt="md">
        {sorted.length === 0 && (
          <Text size="sm" c="dimmed">No options yet. Add the first one below.</Text>
        )}
        {sorted.map((o) => (
          <Group
            key={o.id}
            justify="space-between"
            wrap="nowrap"
            p="xs"
            style={{
              border: "1px solid var(--mantine-color-default-border)",
              borderRadius: 8,
              opacity: o.is_active ? 1 : 0.55,
            }}
          >
            <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
              {o.thumbnail && <Avatar src={o.thumbnail} size={32} radius="sm" />}
              <Box style={{ minWidth: 0 }}>
                <Text fw={500} truncate>
                  {o.name}
                  {!o.is_active && " · hidden"}
                </Text>
                <Text size="xs" c="dimmed">{formatPrice(o.price_modifier)}</Text>
              </Box>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <Switch
                size="sm"
                checked={o.is_active}
                onChange={() => p.onToggleOption(o)}
                aria-label={`Offer ${o.name} to customers`}
              />
              <Button size="compact-xs" variant="subtle" onClick={() => p.onEditOption(o)}>Edit</Button>
            </Group>
          </Group>
        ))}
      </Stack>

      <Button size="xs" variant="light" mt="md" onClick={p.onAddOption}>Add option</Button>
    </Paper>
  );
}
