
import {
    Avatar,
    Box,
    Group,
    Stack,
    Text,
    UnstyledButton,
} from "@mantine/core";

import type { MeasurementProfile } from "../../types/measurement";
import classes from "./measurement.module.css";

interface ProfileListProps {
    profiles: MeasurementProfile[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onCreate: () => void;
}

// 70 inches -> 5'10"
const formatHeight = (inches?: number) =>
    inches ? `${Math.floor(inches / 12)}'${Math.round(inches % 12)}"` : "—";

export default function ProfileList({
    profiles,
    selectedId,
    onSelect,
    onCreate,
}: ProfileListProps) {
    return (
        <Stack gap="md">
            <Stack gap="xs" className={classes.profileList}>
                {profiles.map((profile) => (
                    <UnstyledButton
                        key={profile.id}
                        onClick={() => onSelect(profile.id)}
                        className={`${classes.profileItem} ${
                            profile.id === selectedId
                                ? classes.profileItemActive
                                : ""
                        }`}
                    >
                        <Group gap="sm" wrap="nowrap">
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
                    </UnstyledButton>
                ))}
            </Stack>

            <UnstyledButton
                onClick={onCreate}
                className={classes.createButton}
            >
                + Create new profile
            </UnstyledButton>
        </Stack>
    );
}
