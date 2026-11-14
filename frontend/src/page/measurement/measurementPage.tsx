
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Center,
    Container,
    Flex,
    Loader,
    Stack,
    Text,
} from "@mantine/core";

import type {
    MeasurementProfile,
    MeasurementProfileInput,
} from "../../types/measurement";

import MeasureGuide from "../../components/measurement/measureGuide";
import MeasurementForm from "../../components/measurement/measurementForm";
import ProfileList from "../../components/measurement/profileList";
import classes from "../../components/measurement/measurement.module.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/measurement-profiles`;

// Needed so the browser sends the login cookie with every request
const request = { withCredentials: true };

const getErrorMessage = (error: unknown) =>
    axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "Something went wrong";

export default function MeasurementPage() {
    const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Load all profiles of the logged-in user
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get<MeasurementProfile[]>( API_URL,request );
                setProfiles(response.data);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    // The profile shown on the right: the selected one, or the first one
    const selected = creating
        ? null
        : (profiles.find((profile) => profile.id === selectedId) ??
            profiles[0] ??
            null);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        setCreating(false);
        setEditing(false);
        setError("");
    };

    const handleCreateClick = () => {
        setCreating(true);
        setEditing(false);
        setError("");
    };

    const handleCancel = () => {
        setCreating(false);
        setEditing(false);
        setError("");
    };

    const handleSave = async (input: MeasurementProfileInput) => {
        setSaving(true);
        setError("");

        try {
            if (creating) {
                const response = await axios.post<MeasurementProfile>(
                    API_URL,
                    input,
                    request
                );

                setProfiles((prev) => [response.data, ...prev]);
                setSelectedId(response.data.id);
                setCreating(false);
            } else if (selected) {
                const response = await axios.put<MeasurementProfile>(
                    `${API_URL}/${selected.id}`,
                    input,
                    request
                );

                setProfiles((prev) =>
                    prev.map((p) =>
                        p.id === response.data.id ? response.data : p
                    )
                );

                setEditing(false);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        if (!window.confirm(`Delete "${selected.name}"?`)) return;

        try {
            await axios.delete(`${API_URL}/${selected.id}`, request);

            setProfiles((prev) =>
                prev.filter((p) => p.id !== selected.id)
            );

            setSelectedId(null);
            setEditing(false);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    if (loading) {
        return (
            <Center py="xl">
                <Loader />
            </Center>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Stack gap="md">
                {error && (
                    <Text c="red">
                        {error}
                    </Text>
                )}

                <Flex
                    gap="xl"
                    align="flex-start"
                    className={classes.pageLayout}
                >
                    {/* Left: profile list + guide */}
                    <Stack className={classes.sidebar} gap="xl">
                        <ProfileList
                            profiles={profiles}
                            selectedId={selected?.id ?? null}
                            onSelect={handleSelect}
                            onCreate={handleCreateClick}
                        />

                        <MeasureGuide />
                    </Stack>

                    {/* Right: form */}
                    <Box className={classes.content}>
                        {selected || creating ? (
                            <MeasurementForm
                                key={`${creating ? "new" : selected?.id}-${creating || editing}`}
                                profile={selected}
                                editing={creating || editing}
                                saving={saving}
                                onEdit={() => setEditing(true)}
                                onCancel={handleCancel}
                                onSave={handleSave}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <Text c="dimmed">
                                You have no measurement profiles yet.
                                Click "+ Create new profile" to add one.
                            </Text>
                        )}
                    </Box>
                </Flex>
            </Stack>
        </Container>
    );
}
