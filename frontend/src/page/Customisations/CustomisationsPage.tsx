import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Center,
  Group,
  Loader,
  NavLink,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ruleText, type Group as GroupModel, type Option, type ProductGroup } from "../../components/Customisations/Api";
import { useCustomisations } from "../../components/Customisations/UseCustomisations";
import { GroupCard } from "../../components/Customisations/GroupCard";
import { CustomerPreview } from "../../components/Customisations/CustomerPreview";
import { AttachGroupModal, GroupFormModal, OptionModal } from "../../components/Customisations/Modals";

type OptionTarget = { groupId: string; groupName: string; shared: boolean; option?: Option };

export default function CustomisationsPage() {
  const isLg = useMediaQuery("(min-width: 1100px)");
  const c = useCustomisations();

  const [tab, setTab] = useState<string | null>("products");
  const [groupModal, setGroupModal] = useState<{ mode: "create" | "edit"; group?: GroupModel } | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [optionModal, setOptionModal] = useState<OptionTarget | null>(null);

  if (c.loading) {
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );
  }
  if (c.loadError) {
    return (
      <Center h="100%" p="md">
        <Alert color="red" title="Couldn't load customisations">{c.loadError}</Alert>
      </Center>
    );
  }

  const current = c.products.find((p) => p.id === c.productId);
  const groupOf = (id: string) => c.groups.find((g) => g.id === id);
  const usedNames = (id: string) => (c.usage[id] ?? []).map(c.productName);
  const candidates = c.groups.filter(
    (g) => !c.attached.some((a) => a.id === g.id) && (g.product_id === null || g.product_id === c.productId),
  );

  const openOptionModal = (g: ProductGroup, option?: Option) =>
    setOptionModal({
      groupId: g.id,
      groupName: g.name,
      shared: groupOf(g.id)?.product_id === null && (c.usage[g.id]?.length ?? 0) > 1,
      option,
    });

  const editingGroup = groupModal?.group;

  return (
    <ScrollArea w="100%" h="100%">
      <Box w="90%" mx="auto" py="lg" maw={1280}>
        <Stack gap={2} mb="md">
          <Title order={2}>Customisations</Title>
          <Text c="dimmed" size="sm">
            Manage the choices customers can make on each product, like size, fabric or embroidery.
          </Text>
        </Stack>

        <Tabs value={tab} onChange={setTab} keepMounted={false}>
          <Tabs.List mb="md">
            <Tabs.Tab value="products">Products</Tabs.Tab>
            <Tabs.Tab value="library">Group library</Tabs.Tab>
          </Tabs.List>

          {/* ---------- Products ---------- */}
          <Tabs.Panel value="products">
            {!c.hiddenListable && (
              <Alert color="yellow" variant="light" mb="md" title="Hidden options aren't listed">
                Only active options are shown. Add <code>GET /customisation-groups/:groupId/options</code> (including
                inactive options) to the backend to see and re-enable hidden ones.
              </Alert>
            )}

            <Box
              style={{
                display: "grid",
                gridTemplateColumns: isLg ? "200px minmax(0,1fr) 300px" : "minmax(0,1fr)",
                gap: 20,
                alignItems: "start",
              }}
            >
              {isLg ? (
                <Stack gap={4}>
                  {c.products.map((p) => (
                    <NavLink
                      key={p.id}
                      label={p.name}
                      variant="light"
                      active={p.id === c.productId}
                      onClick={() => c.selectProduct(p.id)}
                      style={{ borderRadius: 8 }}
                    />
                  ))}
                </Stack>
              ) : (
                <Select
                  label="Product"
                  allowDeselect={false}
                  data={c.products.map((p) => ({ value: p.id, label: p.name }))}
                  value={c.productId}
                  onChange={(v) => v && c.selectProduct(v)}
                />
              )}

              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Title order={3}>{current?.name ?? "No products yet"}</Title>
                  <Group gap="xs">
                    <Button variant="default" disabled={!current} onClick={() => setAttachOpen(true)}>
                      Attach group
                    </Button>
                    <Button disabled={!current} onClick={() => setGroupModal({ mode: "create" })}>
                      Create group
                    </Button>
                  </Group>
                </Group>

                {c.attached.length === 0 ? (
                  <Paper withBorder radius="md" p="xl" style={{ borderStyle: "dashed" }}>
                    <Text ta="center" c="dimmed">
                      No customisations on this product yet. Attach a reusable group or create one just for it.
                    </Text>
                  </Paper>
                ) : (
                  c.attached.map((g, i) => (
                    <GroupCard
                      key={g.id}
                      group={g}
                      reusable={groupOf(g.id)?.product_id === null}
                      usedBy={usedNames(g.id)}
                      options={c.options[g.id] ?? g.options}
                      isFirst={i === 0}
                      isLast={i === c.attached.length - 1}
                      onMove={(d) => c.move(g, d)}
                      onRequired={(v) => c.setRequired(g, v)}
                      onEditRules={() => setGroupModal({ mode: "edit", group: groupOf(g.id) })}
                      onDetach={() => c.detach(g)}
                      onAddOption={() => openOptionModal(g)}
                      onEditOption={(o) => openOptionModal(g, o)}
                      onToggleOption={(o) => c.toggleOption(o)}
                    />
                  ))
                )}
              </Stack>

              <CustomerPreview groups={c.attached} />
            </Box>
          </Tabs.Panel>

          {/* ---------- Group library ---------- */}
          <Tabs.Panel value="library">
            <Paper withBorder radius="md" p="md">
              <ScrollArea>
                <Table verticalSpacing="sm" miw={720}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Group</Table.Th>
                      <Table.Th>Scope</Table.Th>
                      <Table.Th>Rules</Table.Th>
                      <Table.Th>Options</Table.Th>
                      <Table.Th>Used by</Table.Th>
                      <Table.Th />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {c.groups.map((g) => {
                      const used = usedNames(g.id);
                      const opts = c.options[g.id] ?? [];
                      const active = opts.filter((o) => o.is_active).length;
                      return (
                        <Table.Tr key={g.id}>
                          <Table.Td fw={600}>{g.name}</Table.Td>
                          <Table.Td>{g.product_id === null ? "Reusable" : `Only ${c.productName(g.product_id)}`}</Table.Td>
                          <Table.Td>{ruleText(g)}</Table.Td>
                          <Table.Td>
                            {c.hiddenListable ? `${active} active of ${opts.length}` : `${active} active`}
                          </Table.Td>
                          <Table.Td>{used.join(", ") || "—"}</Table.Td>
                          <Table.Td>
                            <Group gap="xs" justify="flex-end" wrap="nowrap">
                              <Button size="compact-sm" variant="default" onClick={() => setGroupModal({ mode: "edit", group: g })}>
                                Edit rules
                              </Button>
                              <Tooltip label="Detach it from every product first" disabled={used.length === 0}>
                                <Button
                                  size="compact-sm"
                                  variant="subtle"
                                  color="red"
                                  disabled={used.length > 0}
                                  onClick={() => {
                                    if (window.confirm(`Delete "${g.name}" and its options? This can't be undone.`)) c.deleteGroup(g);
                                  }}
                                >
                                  Delete
                                </Button>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
              {c.groups.length === 0 && (
                <Text ta="center" c="dimmed" py="lg">No groups yet. Create one from a product.</Text>
              )}
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Box>

      {/* ---------- Modals ---------- */}
      <GroupFormModal
        opened={!!groupModal}
        onClose={() => setGroupModal(null)}
        mode={groupModal?.mode ?? "create"}
        initial={editingGroup}
        productName={current?.name}
        sharedWithCount={editingGroup ? (c.usage[editingGroup.id]?.length ?? 0) : 0}
        onSubmit={(v) =>
          groupModal?.mode === "edit" && editingGroup
            ? c.updateGroup(editingGroup.id, {
                name: v.name,
                selection_type: v.selection_type,
                min_selections: v.min_selections,
                max_selections: v.max_selections,
              })
            : c.createGroup(v)
        }
      />

      <AttachGroupModal
        opened={attachOpen}
        onClose={() => setAttachOpen(false)}
        candidates={candidates}
        onAttach={c.attach}
      />

      <OptionModal
        opened={!!optionModal}
        onClose={() => setOptionModal(null)}
        groupName={optionModal?.groupName ?? ""}
        shared={optionModal?.shared ?? false}
        initial={optionModal?.option}
        onSubmit={(v) =>
          optionModal?.option
            ? c.updateOption(optionModal.option.id, {
                name: v.name,
                price_modifier: v.price_modifier,
                thumbnail: v.thumbnail,
              })
            : c.addOption(optionModal!.groupId, {
                name: v.name,
                price_modifier: v.price_modifier,
                ...(v.thumbnail ? { thumbnail: v.thumbnail } : {}),
              })
        }
      />
    </ScrollArea>
  );
}
