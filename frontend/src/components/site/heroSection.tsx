import {
  Stack,
  Badge,
  Text,
  Box,
  Button,
  Image,
  Flex,
  Center,
} from "@mantine/core";
import image from "../../assets/Image/landingPage.avif";
import classes from "./heroSection.module.css";
import { useMediaQuery } from "@mantine/hooks";

export default function HeroSection() {
    
    const isMd = useMediaQuery("(min-width: 768px)");
    
return (
    <Box component="section" w="100%" 
              h={{ base: "auto", md: "600px" }} 
              mt={{ base: "30px", md: "60px" }} 
              >
              <Center w="100%" h="100%">
                <Flex
                  direction={{ base: "column-reverse", md: "row" }}
                  align="flex-start"
                  justify="space-between"
                  wrap="wrap"
                  w="100%"
                  h="100%"
                  mt={0}
                  gap={0}
                >
                  <Stack
                    gap={isMd ? "xl" : "sm"}
                    mt={{ base: "20px", md: "60px" }}
                    w={{ base: "100%", md: "40%" }}
                    align="flex-start"
                  >
                    <Badge
                      leftSection="*"
                      size={isMd ? "xl" : "xs"}
                      variant="light"
                      bg="var(--surface)"
                      ta="center"
                      color="var(--muted)"
                      style={{ border: "1px solid var(--line)" }}
                    >
                      Now available in Nepal
                    </Badge>

                    <Text
                      fw={{ base: 600, md: 800 }}
                      fz={{ base: "25px", md: "60px" }}
                      lh="1.2"
                      ta="left"
                    >
                      Design Your Perfect Outfit.
                    </Text>

                    <Text
                      c="dimmed"
                      size={isMd ? "xl" : "sm"}
                      lh={{ base: 1.4, md: 1.4 }}
                      ta="left"
                    >
                      Custom tailoring, redefined for the digital age. Choose your design,
                      set your measurements, and receive a garment made precisely for you.
                    </Text>

                    <Button

                      size={isMd ? "md" : "xs"}
                      mt={{ base: "xs", md: "sm" }}
                      w="fit-content"
                      className={classes.primaryButton}
                    >
                      Browse Designs
                    </Button>
                  </Stack>

                  <Image
                    src={image}
                    alt="landing page"
                    radius="md"
                    w={{ base: "100%", md: "50%" }}
                    h={{ base: "250px", md: "100%" }}
                    pt={0}
                  />
                </Flex>
              </Center>
            </Box>
);            
}