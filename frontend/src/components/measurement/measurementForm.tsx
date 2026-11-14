
import { useState } from "react";
import {
    Button,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";

import type {
    MeasurementProfile,
    MeasurementProfileInput,
} from "../../types/measurement";

import { MEASUREMENT_FIELDS } from "./measurementFields";
import classes from "./measurement.module.css";

interface MeasurementFormProps {
    profile: MeasurementProfile | null;
    editing: boolean;
    saving: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: (input: MeasurementProfileInput) => void;
    onDelete: () => void;
}

export default function MeasurementForm({
    profile,
    editing,
    saving,
    onEdit,
    onCancel,
    onSave,
    onDelete,
}: MeasurementFormProps) {
    // Draft values the user is typing. Numbers are kept as text while typing.
    const [name, setName] = useState(profile?.name ?? "");
    const [notes, setNotes] = useState(profile?.notes ?? "");
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(
            Object.entries(profile?.measurements ?? {}).map(
                ([key, value]) => [key, String(value)]
            )
        )
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSave = () => {
        const nextErrors: Record<string, string> = {};
        const measurements: Record<string, number> = {};

        if (!name.trim()) {
            nextErrors.name = "Enter a profile name";
        }

        for (const field of MEASUREMENT_FIELDS) {
            const raw = values[field.key]?.trim();

            if (!raw) continue;

            const number = Number(raw);

            if (!Number.isFinite(number) || number <= 0 || number > 120) {
                nextErrors[field.key] = "Enter a number between 0 and 120";
            } else {
                measurements[field.key] = number;
            }
        }

        if (
            Object.keys(nextErrors).length === 0 &&
            Object.keys(measurements).length === 0
        ) {
            nextErrors.form = "Enter at least one measurement";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        onSave({
            name: name.trim(),
            notes: notes.trim(),
            measurements,
        });
    };

    return (
        <Stack className={classes.formPanel} gap="lg">

            {/* Header: name + Edit / Delete */}
            <Group
                className={classes.formHeader}
                justify="space-between"
                align="flex-start"
                wrap="wrap"
            >
                <Stack gap={4} style={{ flex: 1 }}>
                    {editing ? (
                        <TextInput
                            placeholder="Profile name, e.g. Myself"
                            value={name}
                            onChange={(event) =>
                                setName(event.currentTarget.value)
                            }
                            error={errors.name}
                            maxLength={60}
                        />
                    ) : (
                        <Title order={2}>{profile?.name}</Title>
                    )}

                    <Text size="sm" c="dimmed">
                        {editing
                            ? "Enter your measurements in inches"
                            : "Saved measurements · inches"}
                    </Text>
                </Stack>

                {!editing && profile && (
                    <Group gap="sm">
                        <Button variant="default" onClick={onEdit}>
                            Edit
                        </Button>

                        <Button
                            variant="default"
                            color="red"
                            c="red"
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                    </Group>
                )}
            </Group>

            {/* The 11 measurement fields */}
            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3 }}
                spacing="lg"
            >
                {MEASUREMENT_FIELDS.map((field) => (
                    <Stack key={field.key} gap={5}>
                        <Text className={classes.fieldLabel}>
                            {field.label}
                        </Text>

                        {editing ? (
                            <TextInput
                                inputMode="decimal"
                                value={values[field.key] ?? ""}
                                onChange={(event) => {
                                    const value = event.currentTarget.value;
                                    setValues((prev) => ({ ...prev, [field.key]: value }));
                                }}
                                rightSection={
                                    <Text size="sm" c="dimmed">
                                        in
                                    </Text>
                                }
                                error={errors[field.key]}
                            />
                        ) : (
                            <Paper
                                className={classes.valueBox}
                                radius="sm"
                            >
                                <Group justify="space-between">
                                    <Text>
                                        {profile?.measurements[field.key] ?? "—"}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        in
                                    </Text>
                                </Group>
                            </Paper>
                        )}

                        <Text className={classes.fieldHint}>
                            {field.hint}
                        </Text>
                    </Stack>
                ))}
            </SimpleGrid>

            {/* Notes */}
            <Stack className={classes.notesBlock} gap="xs">
                <Text className={classes.fieldLabel}>
                    Additional notes
                </Text>

                {editing ? (
                    <Textarea
                        value={notes}
                        onChange={(event) =>
                            setNotes(event.currentTarget.value)
                        }
                        placeholder="Anything the tailor should know"
                        autosize
                        minRows={2}
                        maxLength={1000}
                    />
                ) : (
                    <Paper className={classes.valueBox} radius="sm">
                        <Text>
                            {profile?.notes || "No additional notes"}
                        </Text>
                    </Paper>
                )}
            </Stack>

            {/* Form error */}
            {errors.form && (
                <Text className={classes.formError} c="red">
                    {errors.form}
                </Text>
            )}

            {/* Buttons while editing */}
            {editing && (
                <Group mt="sm">
                    <Button onClick={handleSave} loading={saving}>
                        Save changes
                    </Button>

                    <Button
                        variant="default"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                </Group>
            )}
        </Stack>
    );
}
