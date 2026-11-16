import {
    Container,
    Stack,
    Group,
    Text,
    Title,
    Badge,
    Loader,
    Center,
    Anchor,
    ScrollArea
} from "@mantine/core";

import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import CustomizeCard from "../../components/productDetail/customizeCard";
import Gallery from "../../components/productDetail/gallery";
import { GROUPS } from "../../components/productDetail/productData";
import SummaryCard from "../../components/productDetail/summaryCard";
import type { Product } from "../../types/product";
import { CURRENT_PROFILE_KEY, type MeasurementProfile } from "../../types/measurement";

const READY_IN_DAYS = 12;

export default function ProductDetailPage() {
    const { id } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        axios
            .get<Product>(
                `${import.meta.env.VITE_API_URL}/api/v1/products/${id}`,
                { signal: controller.signal }
            )
            .then((response) => {
                setProduct(response.data);
                setError(false);
            })
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    setError(true);
                }
            });

        return () => controller.abort();
    }, [id]);

    // Ignore a previously loaded product while a different one is loading.
    const current = product && product.id === id ? product : null;

    if (error) {
        return (
            <Center mih="60vh">
                <Stack align="center" gap="sm">
                    <Title order={3}>
                        We couldn't find this design.
                    </Title>

                    <Anchor component={Link} to="/product">
                        Back to all designs
                    </Anchor>
                </Stack>
            </Center>
        );
    }

    if (!current) {
        return (
            <Center mih="60vh">
                <Loader />
            </Center>
        );
    }

    return <Detail key={current.id} product={current} />;
}

function Detail({ product }: { product: Product }) {
    // The first option of every group is selected by default.
    const [selected, setSelected] = useState<Record<string, string>>(
        () =>
            Object.fromEntries(
                GROUPS.map((group) => [
                    group.id,
                    group.options[0]!.id,
                ])
            )
    );

    const [notes, setNotes] = useState("");

    // Real measurement profiles of the logged-in user
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

                // The profile chosen with "Use for current order", else the first one
                const saved = sessionStorage.getItem(CURRENT_PROFILE_KEY);
                setProfileId(data.find((p) => p.id === saved)?.id ?? data[0]?.id ?? null);
            })
            .catch(() => setProfiles([])); // not logged in, or the request failed
    }, []);

    const images = product.thumbnail ? [product.thumbnail] : [];

    // Only options that cost extra appear as price lines.
    const extras = GROUPS.flatMap((group) => {
        const option = group.options.find(
            (option) => option.id === selected[group.id]
        );

        return option && option.priceModifier > 0
            ? [
                  {
                      label: `${group.name}: ${option.name}`,
                      amount: option.priceModifier,
                  },
              ]
            : [];
    });

    const total =
        product.price +
        extras.reduce((sum, line) => sum + line.amount, 0);

    const handleAddToCart = () => {
        // TODO: Connect your cart.
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
        <Container
            size="xl"
            h="calc(100dvh - 80px)"
            py="md"
            style={{ overflow: "hidden" }}
        >
            <Group
                align="stretch"
                gap="xl"
                wrap="nowrap"
                h="100%"
            >
                {/* Product image stays fixed */}
                <Gallery
                    images={images}
                    alt={product.name}
                />

                {/* Product information scroll area */}
                <ScrollArea
                    flex={1}
                    h="100%"
                    type="auto"
                    scrollbarSize={8}
                    offsetScrollbars="y"
                >
                    <Stack gap="md" pr="sm">

                        {product.featured && (
                            <Badge color="orange" variant="light" w="fit-content">
                                Featured
                            </Badge>
                        )}

                        <Title order={1}>
                            {product.name}
                        </Title>

                        <Stack gap={2}>
                            <Text fw={700} size="xl">
                                NPR {total.toLocaleString("en-IN")}
                            </Text>

                            <Text size="sm" c="dimmed">
                                Includes tailoring
                            </Text>
                        </Stack>

                        <CustomizeCard
                            groups={GROUPS}
                            selected={selected}
                            onSelect={(groupId, optionId) =>
                                setSelected((s) => ({
                                    ...s,
                                    [groupId]: optionId,
                                }))
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
        </Container>
    );
}