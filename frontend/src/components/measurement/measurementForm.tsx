
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    Box,
    Divider,
    Input,
} from "@mantine/core";

import type {
    MeasurementProfile,
    MeasurementProfileInput,
} from "../../types/measurement";

import { MEASUREMENT_FIELDS } from "./measurementFields";
import classes from "./measurement.module.css";
import { notifications } from "@mantine/notifications";

interface MeasurementFormProps {
    profile: MeasurementProfile | null;
    draft: { name: string; measurements: Record<string, number> } | null; // NEW
    editing: boolean;
    saving: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: (input: MeasurementProfileInput) => void;
    onDelete: () => void;
    onUseProfile: () => void;
}

export default function MeasurementForm({
    profile,
    draft,
    editing,
    saving,
    onEdit,
    onCancel,
    onSave,
    onDelete,
    onUseProfile,
}: MeasurementFormProps) {
    // Draft values the user is typing. Numbers are kept as text while typing.
    const [name, setName] = useState(profile?.name ?? draft?.name ?? "");
    const [notes, setNotes] = useState(profile?.notes ?? "");
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(
            Object.entries(profile?.measurements ?? {}).map(
                ([key, value]) => [key, String(value)]
            )
        )
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const navigate = useNavigate();
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
        notifications.show({
            title: "Changes Saved",
            message: "Your measurement profile has been updated successfully.",
            color: "green",
        });
    };

    return (
        <Box bd="1px solid var(--line)"
            bdrs="lg"
            bg="var(--surface)">
            <Stack className={classes.formPanel} gap="lg"  >

            {/* Header: name + Edit / Delete */}
                <Group
                    className={classes.formHeader}
                    justify="space-between"
                    align="flex-start"
                    wrap="wrap"
                    px="lg" pt="lg"
                >
                    <Stack gap={4} style={{ flex: 1 }}>
                        {editing && profile ? (
                            <TextInput
                                classNames={{
                                    input: "inputField",
                                }}
                                placeholder="Profile name, e.g. Myself"
                                value={name}
                                onChange={(event) => setName(event.currentTarget.value)}
                                error={errors.name}
                                maxLength={60}
                            />
                        ) : (
                            <Title order={2}>{profile?.name ?? draft?.name}</Title>
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
                <Divider color="var(--line)" />

                {/* The 11 measurement fields */}
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3 }}
                    spacing="lg"
                    px="lg"
                >
                    {MEASUREMENT_FIELDS.map((field) => (
                        <Stack key={field.key} gap="5px">
                            <Text                               
                                className={classes.fieldLabel}
                                fw={{ base: 200, md: 500 }}
                                fz={{ base: "12px", md: "15px" }}
                                c="var(--muted)"
                            >
                                {field.label}
                            </Text>

                            {editing ? (
                                <TextInput
                                    classNames={{
                                        input: "inputField",
                                    }}
                                    inputMode="decimal"
                                    value={values[field.key] ?? ""}
                                    onChange={(event) => {
                                        const value = event.currentTarget.value;
                                        setValues((prev) => ({
                                            ...prev,
                                            [field.key]: value,
                                        }));
                                    }}
                                    rightSection={
                                        <Text size="sm" c="dimmed">
                                            in
                                        </Text>
                                    }
                                    error={errors[field.key]}
                                />
                            ) : (
                                <Input
                                    classNames={{
                                        input: "inputField",
                                    }}
                                    value={profile?.measurements[field.key] ?? "—"}
                                    readOnly
                                    rightSection={
                                        <Text size="sm" c="dimmed">
                                            in
                                        </Text>
                                    }
                                />
                            )}

                            <Text
                                className={classes.fieldHint}
                                c="dimmed"
                                fz="xs"
                            >
                                {field.hint}
                            </Text>
                        </Stack>
                    ))}
                </SimpleGrid>

                {/* Notes */}
                <Stack className={classes.notesBlock} gap="xs" p="lg">
                    <Text className={classes.fieldLabel} fw={{ base: 200, md: 500 }}
                                fz={{ base: "15px", md: "18px" }}
                                c="var(--muted)">
                        Additional notes
                    </Text>

                    {editing ? (
                        <Textarea
                            classNames={{
                                input: "inputField",
                            }}
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
                            <Text
                                fz={{ base: "10px", md: "12px" }}
                                c="var(--muted)" >
                                {profile?.notes || "No additional notes"}
                            </Text>
                        </Paper>
                    )}
                </Stack>

                {/* Form error */}
                {errors.form && (
                    <Text className={classes.formError} c="red" pl="lg">
                        {errors.form}
                    </Text>
                )}

                {/* Buttons while editing */}
                {editing ? (
                    <Group px="lg" pb="lg">
                        <Button onClick={handleSave} loading={saving} className="primaryButton">
                            Save changes
                        </Button>

                        <Button
                            className="secondaryButton"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        
                    </Group>
                ):(
                    <Group px="lg" pb="lg">
                        <Button
                            className="primaryButton"
                            onClick={onUseProfile}
                        >
                            Use for current order
                        </Button>
                        <Button
                            className="secondaryButton"
                            onClick={()=>navigate(-1)}
                        >
                            Back
                        </Button>
                    </Group>
                )}
            </Stack>
        </Box>
    );
}
