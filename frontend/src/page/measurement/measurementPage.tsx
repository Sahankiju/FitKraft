
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Center, Flex, Group, Loader, Modal, Text, Stack, Box } from "@mantine/core";

import type {
    MeasurementProfile,
    MeasurementProfileInput,
} from "../../types/measurement";

import MeasureGuide from "../../components/measurement/measureGuide";
import MeasurementForm from "../../components/measurement/measurementForm";
import classes from "../../components/measurement/measurement.module.css";
import ProfileList, { type NewProfileInput } from "../../components/measurement/profileList";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { CURRENT_PROFILE_KEY } from "../../types/measurement";

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
    const [confirmOpen, setConfirmOpen] = useState(false); 
    const [draftVersion, setDraftVersion] = useState(0);
    const [newProfileInput, setNewProfileInput] = useState<NewProfileInput | null>(null);
    
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
    
    
    
    const navigate = useNavigate();
    // The profile shown on the right: the selected one, or the first one
    const selected = creating
    ? null
    : (profiles.find((profile) => profile.id === selectedId) ??
            profiles[0] ??
            null);
    
    // What the form starts with while a new profile is being created
    const draft =
    creating && newProfileInput
    ? {
        name: newProfileInput.name,
        measurements:
        profiles.find((p) => p.id === newProfileInput.copyFromId)?.measurements ?? {},
    }
    : null;
    
    const handleUseProfile = () => {
        if (!selected) return;

        // Remember the choice for the product detail page
        sessionStorage.setItem(CURRENT_PROFILE_KEY, selected.id);

        notifications.show({
            title: "Profile selected",
            message: `"${selected.name}" will be used for your order.`,
            color: "green",
        });

         navigate(-1);
        
    };   
         
    const handleSelect = (id: string) => {
        setSelectedId(id);
        setCreating(false);
        setEditing(false);
        setError("");
    };

    const handleCreateClick = (input: NewProfileInput) => {
        setNewProfileInput(input);
        setDraftVersion((v) => v + 1);
        setCreating(true);
        setEditing(false);
        setError("");
    };

    const handleCancel = () => {
        setCreating(false);
        setEditing(false);
        setNewProfileInput(null);
        setError("");
    };

    const handleSave = async (input: MeasurementProfileInput) => {
        setSaving(true);
        setError("");

        try {
            if (creating) {
                const response = await axios.post<MeasurementProfile>(
                    API_URL,
                    {
                        ...input,
                        relation: newProfileInput?.relation,
                        copyFromId: newProfileInput?.copyFromId,
                    },
                    request
                );

                setProfiles((prev) => [response.data, ...prev]);
                setSelectedId(response.data.id);
                setCreating(false);
                setNewProfileInput(null);
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

        const profileId = selected.id;
        const profileName = selected.name;
        setConfirmOpen(false); // close the popup first, so it can't be pressed twice

        try {
            await axios.delete(`${API_URL}/${profileId}`, request);

            setProfiles((prev) => prev.filter((p) => p.id !== profileId));
            setSelectedId(null);
            setEditing(false);

            notifications.show({
                title: "Profile deleted",
                message: `"${profileName}" has been deleted.`,
                color: "green",
            });
        } catch (err) {
            notifications.show({
                title: "Could not delete profile",
                message: getErrorMessage(err),
                color: "red",
            });
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
        <Box w="85%" py="lg" mx="auto">
            <Stack gap="lg">
                {error && (
                    <Text c="red">
                        {error}
                    </Text>
                )}
                <Stack gap={0}>
                    <Text
                    fw={{ base: 300, md: 500 }}
                    fz={{ base: "20px", md: "40px" }}
                    >
                    Measurement profiles</Text>
                    <Text
                      c="dimmed"
                      fz={{ base: "12px", md: "15px" }}
                    >Save measurements once and reuse them for every order.</Text>
                </Stack>

                <Flex
                    gap="xl"
                    align="flex-start"
                    className={classes.pageLayout}
                    
                >
                    {/* Left: profile list + guide */}
                    <Stack className={classes.sidebar} >
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
                                key={`${creating ? `new-${draftVersion}` : selected?.id}-${creating || editing}`}
                                profile={selected}
                                draft={draft}
                                editing={creating || editing}
                                saving={saving}
                                onEdit={() => setEditing(true)}
                                onCancel={handleCancel}
                                onSave={handleSave}
                                onDelete={() => setConfirmOpen(true)}
                                onUseProfile={handleUseProfile}
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
            <Modal
                opened={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Delete profile"
                centered
            >
                <Text size="sm">
                    Are you sure you want to delete "{selected?.name}"? This cannot be undone.
                </Text>

                <Group justify="flex-end" mt="lg">
                    <Button variant="default" onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={handleDelete}>
                        OK, delete
                    </Button>
                </Group>
            </Modal>
        </Box>
    );
}
