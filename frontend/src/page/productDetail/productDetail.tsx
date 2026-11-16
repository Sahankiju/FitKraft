import {
    Stack,
    Group,
    Text,
    Title,
    Badge,
    ScrollArea,
    Box
} from "@mantine/core";

import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

import CustomizeCard from "../../components/productDetail/customizeCard";
import Gallery from "../../components/productDetail/gallery";
import { GROUPS } from "../../components/productDetail/productData";
import SummaryCard from "../../components/productDetail/summaryCard";
import type { Product } from "../../types/product";
import { CURRENT_PROFILE_KEY, type MeasurementProfile } from "../../types/measurement";

export { productDetailLoader } from "./productDetail.Loader"; // or wherever you put it

const READY_IN_DAYS = 12;

export default function ProductDetail() {
    // React Router already fetched this before rendering — no loading/error state needed.
    const product = useLoaderData() as Product;

    return <Detail key={product.id} product={product} />;
}

function Detail({ product }: { product: Product }) {
    const { groups, loading: groupsLoading } = GROUPS();

    const [selected, setSelected] = useState<Record<string, string>>({});

    useEffect(() => {
        if (groups.length === 0) return;

        setSelected((prev) => {
            const next = { ...prev };
            for (const group of groups) {
                if (!(group.id in next) && group.options[0]) {
                    next[group.id] = group.options[0].id;
                }
            }
            return next;
        });
    }, [groups]);

    const [notes, setNotes] = useState("");

    const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
    const [profileId, setProfileId] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get<MeasurementProfile[]>(
                `${import.meta.env.VITE_API_URL}/api/v1/measurement-profiles`,
                { withCredentials: true }
            )
            .then(({ data }) => {
                setProfiles(data);
                const saved = sessionStorage.getItem(CURRENT_PROFILE_KEY);
                setProfileId(data.find((p) => p.id === saved)?.id ?? data[0]?.id ?? null);
            })
            .catch(() => setProfiles([]));
    }, []);

    const images = product.thumbnail ? [product.thumbnail] : [];

    const extras = groups.flatMap((group) => {
        const option = group.options.find(
            (option) => option.id === selected[group.id]
        );

        return option && option.priceModifier > 0
            ? [{ label: `${group.name}: ${option.name}`, amount: option.priceModifier }]
            : [];
    });

    const total = product.price + extras.reduce((sum, line) => sum + line.amount, 0);

    const handleAddToCart = () => {
        console.log({
            productId: product.id,
            name: product.name,
            unitPrice: total,
            selections: selected,
            notes: notes.trim(),
            profileId,
        });
    };

    return (
        <Box w="85%" py="md" mx="auto">
            <Group align="stretch" gap="xl" wrap="nowrap" h="100%">
                <Gallery images={images} alt={product.name} />

                <ScrollArea flex={1} h="100%" type="auto" scrollbarSize={8} offsetScrollbars="y">
                    <Stack gap="md" pr="sm">
                        {product.featured && (
                            <Badge color="orange" variant="light" w="fit-content">
                                Featured
                            </Badge>
                        )}

                        <Title order={1}>{product.name}</Title>

                        <Stack gap={2}>
                            <Text>NPR {total.toLocaleString("en-IN")}</Text>
                            <Text size="sm" c="dimmed">Includes tailoring</Text>
                        </Stack>

                        <CustomizeCard
                            groups={groups}
                            loading={groupsLoading}
                            selected={selected}
                            onSelect={(groupId, optionId) =>
                                setSelected((s) => ({ ...s, [groupId]: optionId }))
                            }
                            notes={notes}
                            onNotes={setNotes}
                        />

                        <SummaryCard
                            total={total}
                            basePrice={product.price}
                            extras={extras}
                            readyInDays={READY_IN_DAYS}
                            profiles={profiles}
                            profileId={profileId}
                            onProfile={setProfileId}
                            onAdd={handleAddToCart}
                        />
                    </Stack>
                </ScrollArea>
            </Group>
        </Box>
    );
}