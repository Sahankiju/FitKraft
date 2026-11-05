import { Box, Button, Group, Stack, Text } from "@mantine/core";
import classes from "./howItWorks.module.css";
import { useMediaQuery } from "@mantine/hooks";

const steps = [
  {
    number: "01",
    title: "Choose Design",
    description: "Browse our catalog",
  },
  {
    number: "02",
    title: "Customize",
    description: "Fabric, color, style",
  },
  {
    number: "03",
    title: "Add Measurements",
    description: "Saved or new profile",
  },
  {
    number: "04",
    title: "Tailor Crafts It",
    description: "Expert hands at work",
  },
  {
    number: "05",
    title: "Delivery",
    description: "At your doorstep",
  },
];

export default function HowItWorks() {
  const isMd = useMediaQuery("(min-width: 768px)");
  return (
    <Box className={classes.content} w="100%">
      <Stack align="center" gap={0} w="100%">
        <Text className={classes.eyebrow} c="dimmed">
          SIMPLE PROCESS
        </Text>

        <Text className={classes.title}>How It Works</Text>

        <Group className={classes.steps} gap={0} align="flex-start">
          {steps.map((step, index) => (
            <Box key={step.number} className={classes.stepWrapper}>
              <Box className={classes.step}>
                <Text className={classes.number}>{step.number}</Text>
              </Box>

              <Box className={classes.stepText}>
                <Text className={classes.stepTitle}>{step.title}</Text>
                <Text className={classes.description}>{step.description}</Text>
              </Box>

              {index < steps.length - 1 && (
                <Box className={classes.line}>
                  <Text className={classes.arrow}>→</Text>
                </Box>
              )}
            </Box>
          ))}
        </Group>

        <Button size={isMd ? "md" : "xs"} mt={{ base: "xs", md: "sm" }} w="fit-content" className={classes.primaryButton}>
          Start Your Order
        </Button>
      </Stack>
    </Box>
  );
}