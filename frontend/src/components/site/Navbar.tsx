import { AppShell, Stack, Group, Text, Anchor, Breadcrumbs } from "@mantine/core";
import { useLocation } from "react-router";

export function Navbar() {
  const location = useLocation();

  const pathNames = location.pathname.split("/").filter(Boolean);

  const items = pathNames.map((path, index) => {
    const href = "/" + pathNames.slice(0, index + 1).join("/");

    const title = path
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <Anchor href={href} key={href} size="12px" c="black">
        {title}
      </Anchor>
    );
  });

  return (
    <AppShell.Header>
      <Stack gap={0} w="100%">
        <Group w="100%" h="50px" justify="space-between" align="center" px="md" py="0" bg="gray.1">
          <Text fw={700} size="35px">
            FitKraft
          </Text>

          <Group gap="xl">
            <Anchor href="#" c="black" underline="never" fw={500}>Home</Anchor>
            <Anchor href="#" c="black" underline="never">Categories</Anchor>
            <Anchor href="#" c="black" underline="never">How it Works</Anchor>
            <Anchor href="#" c="black" underline="never">About</Anchor>
            <Anchor href="#" c="black" underline="never">Contact</Anchor>
          </Group>

          <Group>
            <Anchor href="#">Cart</Anchor>
            <Anchor href="#">Profile</Anchor>
          </Group>
        </Group>

        <Breadcrumbs separator="/" separatorMargin="5px" px="md" bg="gray.4" h="20px">
          {items}
        </Breadcrumbs>
      </Stack>
    </AppShell.Header>
  );
}