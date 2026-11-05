import { AppShell, Stack, Group, Text, Breadcrumbs, Burger,Anchor,
  Button,
  Divider,
  Drawer,
  ScrollArea,} from "@mantine/core";
import { useLocation } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';

export function Navbar() {
  const location = useLocation();

  const pathNames = location.pathname.split("/").filter(crumb => crumb !== '');

  const items = pathNames.map((path, index) => {
    const href = "/" + pathNames.slice(0, index + 1).join("/");

    const title = path
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <Anchor href={href} key={href} size="12px">
        {title}
      </Anchor>
    );
  });
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <AppShell.Header bg="var(--bg)" w="100%">
      <Stack gap={0} w="100%">
        <Group h={{ base: "35px", md: "60px" }} justify="space-between" align="center" mx="auto" w="85vw" py="0" >
          <Text fw={{ base: 600, md: 700 }} fz={{ base: "20px", md: "30px" }} lh={{ base: 1, md: 1.2 }}>
            FitKraft
          </Text>

          <Group gap="xl" visibleFrom="sm">
            <Anchor href="#" c="var(--muted)" underline="never" fz={16} fw={500}>Home</Anchor>
            <Anchor href="#" c="var(--muted)" underline="never" fz={16}>Categories</Anchor>
            <Anchor href="#" c="var(--muted)" underline="never" fz={16}>How it Works</Anchor>
            <Anchor href="#" c="var(--muted)" underline="never" fz={16}>About</Anchor>
            <Anchor href="#" c="var(--muted)" underline="never" fz={16}>Contact</Anchor>
          </Group>

          <Group visibleFrom="sm">
            <Anchor href="#">Cart</Anchor>
            <Anchor href="#">Profile</Anchor>
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
            aria-label="Toggle navigation"
          />
        </Group>
        <Divider />
        <Breadcrumbs separator="/" separatorMargin="5px" h={{ base: "15px", md: "20px" }} mx="auto" w="85vw">
          {items}
        </Breadcrumbs>
      </Stack>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="FitKraft"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md" px="md">
          <Divider my="sm" />
            <Anchor href="#" underline="never" c="var(--muted)" fw={500} display="block">Home</Anchor>
            <Anchor href="#" underline="never" c="var(--muted)" display="block">Categories</Anchor>
            <Anchor href="#" underline="never" c="var(--muted)" display="block">How it Works</Anchor>
            <Anchor href="#" underline="never" c="var(--muted)" display="block">About</Anchor>
            <Anchor href="#" underline="never" c="var(--muted)" display="block">Contact</Anchor>
          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Cart</Button>
            <Button>Profile</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </AppShell.Header>
  );
}