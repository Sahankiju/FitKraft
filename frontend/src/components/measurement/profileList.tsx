import { useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Group,
    Modal,
    NativeSelect,
    Stack,
    Text,
    TextInput,
    UnstyledButton,
} from "@mantine/core";

import type { MeasurementProfile } from "../../types/measurement";
import classes from "./measurement.module.css";
import { notifications } from "@mantine/notifications";

// What the popup hands back to the page
export interface NewProfileInput {
    name: string;
    relation: string;
    copyFromId: string | null; // id of the profile to copy values from, or null for empty
}

interface ProfileListProps {
    profiles: MeasurementProfile[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onCreate: (input: NewProfileInput) => void;
}

const RELATIONS = ["self", "father", "mother", "brother", "sister", "spouse", "child", "other"];

// 70 inches -> 5'10"
const formatHeight = (inches?: number) =>
    inches ? `${Math.floor(inches / 12)}'${Math.round(inches % 12)}"` : "—";

export default function ProfileList({
    profiles,
    selectedId,
    onSelect,
    onCreate,
}: ProfileListProps) {
    // Popup state
    const [opened, setOpened] = useState(false);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [relation, setRelation] = useState("self");
    const [copyFromId, setCopyFromId] = useState("");

    // Reset the popup every time it opens
    const openModal = () => {
        setName("");
        setNameError("");
        setRelation("self");
        setCopyFromId(selectedId ?? profiles[0]?.id ?? "");
        setOpened(true);
    };


    const handleSubmit = () => {
        if (!name.trim()) {
            setNameError("Enter a profile name");
            return;
        }

        onCreate({
            name: name.trim(),
            relation,
            copyFromId: copyFromId || null,
        });

        notifications.show({
            title: `New Profile created named "${name}"`,
            message: "Your new profile is ready. Add your measurements to get started.",
            color: "green",
        });

        setOpened(false);
    };

    return (
        <Box bg="var(--surface)">
            <Stack gap="md">
                {profiles.length > 0 && (
                    <Box bd="1px solid var(--line)" bdrs="lg" style={{ overflow: "hidden" }}>
                        <Stack gap="0px" className={classes.profileList}>
                            {profiles.map((profile, index) => (
                                <UnstyledButton
                                    key={profile.id}
                                    onClick={() => onSelect(profile.id)}
                                    className={`${classes.profileItem} ${
                                        profile.id === selectedId
                                            ? classes.profileItemActive
                                            : ""
                                    }`}
                                >
                                    <Group gap="sm" wrap="nowrap" p="sm">
                                        <Avatar
                                            radius="xl"
                                            size={48}
                                            className={classes.profileAvatar}
                                        >
                                            {profile.name.charAt(0).toUpperCase()}
                                        </Avatar>

                                        <Box style={{ minWidth: 0, flex: 1 }}>
                                            <Text fw={600} truncate>
                                                {profile.name}
                                            </Text>

                                            <Text size="sm" c="dimmed">
                                                Height {formatHeight(profile.measurements.height)}
                                            </Text>
                                        </Box>
                                    </Group>
                                    {index < profiles.length - 1 && (
                                        <Divider color="var(--line)" />
                                    )}
                                </UnstyledButton>
                            ))}
                        </Stack>
                    </Box>
                )}

                <UnstyledButton
                    onClick={openModal}
                    className={classes.createButton}
                    bd="2px dotted var(--peach)"
                    bdrs="lg"
                    p="sm"
                    ta="center"
                >
                    + Create new profile
                </UnstyledButton>
            </Stack>

            {/* Popup: New measurement profile */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="New measurement profile"
                radius="lg"
                size="md"
                centered
            >
                <Text size="sm" c="dimmed" mb="md" >
                    Start from an existing profile, then adjust the values.
                </Text>

                <Stack gap="md">
                    <TextInput
                        classNames={{
                            input: "inputField"
                        }}
                        label="Name"
                        placeholder="For example, Brother"
                        value={name}
                        onChange={(event) => {
                            setName(event.currentTarget.value);
                            setNameError("");
                        }}
                        error={nameError}
                        maxLength={60}
                        data-autofocus
                    />

                    <NativeSelect
                        classNames={{
                            input: "inputField"
                        }}
                        label="Relation"
                        value={relation}
                        onChange={(event) => setRelation(event.currentTarget.value)}
                        data={RELATIONS}
                    />

                    {profiles.length > 0 && (
                        <NativeSelect
                            classNames={{
                                input: "inputField"
                            }}
                            label="Copy values from"
                            value={copyFromId}
                            onChange={(event) => setCopyFromId(event.currentTarget.value)}
                            data={[
                                { value: "", label: "Start empty" },
                                ...profiles.map((p) => ({ value: p.id, label: p.name })),
                            ]}
                        />
                    )}

                    <Group>
                        <Button onClick={handleSubmit} className="primaryButton">Create profile</Button>
                        <Button variant="default" onClick={() => setOpened(false)} className="secondaryButton">
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Box>
    );
}