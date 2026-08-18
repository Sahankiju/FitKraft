import { ScrollArea, Container, Stack, Group, Badge, Text, Divider } from "@mantine/core";

export default function HomePage() {
  return (
    <ScrollArea h="calc(100vh - 70px)" mt="70px">
      <Container>
        <Stack>
          <Group align="center" justify="space-between">
            <Stack>
              <Badge color="blue">Now available in Nepal</Badge>
              <Text fw={700} size="40px">Design Your Perfect Outfit.</Text>
              <Text>
                Custom tailoring, redefined for the digital age. Choose your design,
                set your measurements, and receive a garment made precisely for you.
              </Text>
              <button>Browse Designs</button>
            </Stack>
          </Group>

          <Divider my="md" />

          <Stack>
            <Text>Browse By</Text>
            <Text fw={700} size="30px">Featured Categories</Text>
          </Stack>
        </Stack>
      </Container>
    </ScrollArea>
  );
}