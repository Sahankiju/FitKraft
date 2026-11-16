import { Box, Divider, Group, Text } from "@mantine/core";

export function Footer() {
  return (
      <Box
      component="footer"
      w="100%"
      py={{ base: "md", md: "lg" }}
      >
      <Divider color="var(--line)" mb="md" />

      <Group
        align="center"
        justify="space-between"
        w="85%"
        mx="auto"
        wrap="wrap"
      >
        <Text
          fz={{ base: 11, sm: 12, md: 14 }}
          c="var(--muted)"
        >
          © 2026 FitKraft · Custom tailoring, delivered across Nepal
        </Text>

        <Text
          fz={{ base: 11, sm: 12, md: 14 }}
          c="var(--muted)"
        >
          eSewa · Khalti · Cash on delivery
        </Text>
      </Group>
    </Box>
  );
}