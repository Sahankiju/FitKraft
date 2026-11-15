import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { ruleText, type Group as GroupModel, type Option, type SelectionType } from "./Api";

/* ---------- Create / edit a group ---------- */

export interface GroupFormValues {
  name: string;
  ownOnly: boolean;
  selection_type: SelectionType;
  min_selections: number;
  max_selections: number | null;
}

interface GroupFormProps {
  opened: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initial?: GroupModel;
  productName?: string;
  sharedWithCount?: number;
  onSubmit: (v: GroupFormValues) => Promise<string | null>;
}

export function GroupFormModal({ opened, onClose, mode, initial, productName, sharedWithCount = 0, onSubmit }: GroupFormProps) {
  const [name, setName] = useState("");
  const [ownOnly, setOwnOnly] = useState(false);
  const [type, setType] = useState<SelectionType>("single");
  const [mustChoose, setMustChoose] = useState(false);
  const [min, setMin] = useState<number | string>(0);
  const [max, setMax] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!opened) return;
    setError(null);
    setName(initial?.name ?? "");
    setOwnOnly(false);
    setType(initial?.selection_type ?? "single");
    setMustChoose((initial?.min_selections ?? 0) >= 1);
    setMin(initial?.min_selections ?? 0);
    setMax(initial?.max_selections ?? "");
  }, [opened, initial?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("Enter a group name.");

    let mn = mustChoose ? 1 : 0;
    let mx: number | null = 1;
    if (type === "multiple") {
      mn = Number(min === "" ? 0 : min);
      mx = max === "" ? null : Number(max);
      if (!Number.isInteger(mn) || mn < 0) return setError("Minimum must be a whole number, 0 or more.");
      if (mx !== null && (!Number.isInteger(mx) || mx < 1)) return setError("Maximum must be 1 or more, or blank for no limit.");
      if (mx !== null && mx < mn) return setError("Maximum can't be lower than the minimum.");
    }

    setSaving(true);
    const err = await onSubmit({ name: trimmed, ownOnly, selection_type: type, min_selections: mn, max_selections: mx });
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} centered title={mode === "create" ? "Create a group" : "Edit group rules"}>
      <Stack>
        {error && <Alert color="red" variant="light">{error}</Alert>}
        {mode === "edit" && sharedWithCount > 1 && (
          <Alert color="yellow" variant="light">
            This group is used by {sharedWithCount} products. Rule changes apply to all of them.
          </Alert>
        )}

        <TextInput
          label="Group name"
          placeholder="e.g. Buttons"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          data-autofocus
        />

        {mode === "create" && (
          <Stack gap={4}>
            <Text size="sm" fw={500}>Who can use it</Text>
            <SegmentedControl
              fullWidth
              value={ownOnly ? "own" : "reusable"}
              onChange={(v) => setOwnOnly(v === "own")}
              data={[
                { value: "reusable", label: "All products" },
                { value: "own", label: `Only ${productName ?? "this product"}` },
              ]}
            />
            <Text size="xs" c="dimmed">
              Reusable groups (like Size) can be attached to any product and are edited in one place.
            </Text>
          </Stack>
        )}

        <Stack gap={4}>
          <Text size="sm" fw={500}>How customers choose</Text>
          <SegmentedControl
            fullWidth
            value={type}
            onChange={(v) => setType(v as SelectionType)}
            data={[
              { value: "single", label: "One choice" },
              { value: "multiple", label: "Several choices" },
            ]}
          />
        </Stack>

        {type === "single" ? (
          <Switch
            label="Customer must pick one"
            checked={mustChoose}
            onChange={(e) => setMustChoose(e.currentTarget.checked)}
          />
        ) : (
          <Group grow align="flex-start">
            <NumberInput label="Minimum" min={0} allowDecimal={false} value={min} onChange={setMin} />
            <NumberInput label="Maximum" placeholder="No limit" min={1} allowDecimal={false} value={max} onChange={setMax} />
          </Group>
        )}

        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={submit}>
            {mode === "create" ? "Create and attach" : "Save changes"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

/* ---------- Attach an existing group ---------- */

interface AttachProps {
  opened: boolean;
  onClose: () => void;
  candidates: GroupModel[]; // not yet attached, and reusable or owned by this product
  onAttach: (groupId: string) => Promise<string | null>;
}

export function AttachGroupModal({ opened, onClose, candidates, onAttach }: AttachProps) {
  const [value, setValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (opened) {
      setValue(null);
      setError(null);
    }
  }, [opened]);

  const item = (g: GroupModel) => ({ value: g.id, label: `${g.name} · ${ruleText(g)}` });
  const reusable = candidates.filter((g) => g.product_id === null).map(item);
  const own = candidates.filter((g) => g.product_id !== null).map(item);
  const data = [
    ...(reusable.length ? [{ group: "Reusable", items: reusable }] : []),
    ...(own.length ? [{ group: "Only this product", items: own }] : []),
  ];

  const submit = async () => {
    if (!value) return setError("Choose a group to attach.");
    setSaving(true);
    const err = await onAttach(value);
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} centered title="Attach an existing group">
      <Stack>
        {error && <Alert color="red" variant="light">{error}</Alert>}
        {data.length === 0 ? (
          <Text size="sm" c="dimmed">Every available group is already attached. Create a new group instead.</Text>
        ) : (
          <Select label="Group" placeholder="Choose a group" data={data} value={value} onChange={setValue} searchable />
        )}
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button loading={saving} disabled={data.length === 0} onClick={submit}>Attach group</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

/* ---------- Add / edit an option ---------- */

export interface OptionFormValues {
  name: string;
  price_modifier: number;
  thumbnail: string | null; // null = none
}

interface OptionProps {
  opened: boolean;
  onClose: () => void;
  groupName: string;
  shared: boolean;
  initial?: Option;
  onSubmit: (v: OptionFormValues) => Promise<string | null>;
}

export function OptionModal({ opened, onClose, groupName, shared, initial, onSubmit }: OptionProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>(0);
  const [thumb, setThumb] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!opened) return;
    setError(null);
    setName(initial?.name ?? "");
    setPrice(initial?.price_modifier ?? 0);
    setThumb(initial?.thumbnail ?? "");
  }, [opened, initial?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const thumbOk = /^https?:\/\//i.test(thumb.trim());

  const submit = async () => {
    const n = name.trim();
    const pr = Number(price === "" ? 0 : price);
    const t = thumb.trim();
    if (!n) return setError("Enter an option name.");
    if (!Number.isInteger(pr)) return setError("Price change must be a whole number.");
    if (t && !thumbOk) return setError("Image link must start with http:// or https://");

    setSaving(true);
    const err = await onSubmit({ name: n, price_modifier: pr, thumbnail: t || null });
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} centered title={`${initial ? "Edit option" : "Add option"} · ${groupName}`}>
      <Stack>
        {error && <Alert color="red" variant="light">{error}</Alert>}
        {shared && (
          <Alert color="yellow" variant="light">
            {groupName} is reusable. This change shows up on every product that uses it.
          </Alert>
        )}
        <TextInput label="Option name" placeholder="e.g. Contrast buttons" value={name} onChange={(e) => setName(e.currentTarget.value)} data-autofocus />
        <NumberInput
          label="Price change (NPR)"
          description="Use a negative number for a discount, 0 for no extra cost."
          allowDecimal={false}
          value={price}
          onChange={setPrice}
        />
        <Group align="flex-end" wrap="nowrap">
          <TextInput
            style={{ flex: 1 }}
            label="Image link (optional)"
            placeholder="https://…"
            value={thumb}
            onChange={(e) => setThumb(e.currentTarget.value)}
          />
          {thumbOk && <Avatar src={thumb.trim()} size={36} radius="sm" />}
        </Group>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={submit}>{initial ? "Save changes" : "Add option"}</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
