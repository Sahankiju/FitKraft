import {
  ScrollArea,
  Stack,
  Group,
  Badge,
  Text,
  Box,
  Button,
  Anchor,
  Image,
  Flex,
  Center,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import image from "../../assets/image/landingPage.avif";
import { FeaturedCategories } from "../../components/categories/featuredCategory";
import HowItWorks from "../../components/site/howItWorks";
import AboutUs from "../about/aboutUs";
import classes from "./homePage.module.css";

export default function HomePage() {
  const isMd = useMediaQuery("(min-width: 768px)");
  return (
    <ScrollArea
      h={{ base: "calc(100vh - 50px)", md: "calc(100vh - 70px)" }}
      mt={{ base: "50px", md: "70px" }}
      w="100vw"
      >
      <Box w="90vw" mx="auto" h="100%">
        <Box px={{ base: "10px", md: "25px" }} w="100%">
          <Stack gap={0} w="100%">

            {/* Hero Section */}
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
                    mt={{ base: "20px", md: "40px" }}
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
                      fz={{ base: "25px", md: "70px" }}
                      lh={{ base: 1.2, md: 1 }}
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

            {/* Featured Categories Section */}
            <Box component="section" pt={ isMd ? "40px" : "25px"} w="100%">
              <Stack gap={isMd ? 10 : 0}  w="100%">
                <Text c="dimmed" size={isMd ? "md" : "10px"}>
                  Browse By
                </Text>

                <Group justify="space-between" align="center">
                <Text fw={{ base: 600, md: 700 }} fz={{ base: "20px", md: "30px" }}>
                    Featured Categories
                  </Text>

                  <Anchor href="" underline="always" size={isMd ? "md" : "10px"}>
                    View All
                  </Anchor>
                </Group>

                <FeaturedCategories />
              </Stack>
            </Box>


            {/* Featured Products Section */}
            <Box component="section"  pt={ isMd ? "40px" : "25px"}>
              <Stack gap={isMd ? 10 : 0}  w="100%">
                <Group justify="space-between" align="center">
                  <Text fw={{ base: 600, md: 700 }} fz={{ base: "20px", md: "30px" }}>
                    Featured Products
                  </Text>

                  <Badge
                    size={isMd ? "sm" : "xs"}
                    variant="gradient"
                    ta="center"
                    gradient={ 
                      { from: "blue", to: "cyan", deg: 90 }
                    }
                  >
                    Best Seller
                  </Badge>
                </Group>
              </Stack>
            </Box>

            {/* How It Works Section */}
            <Box component="section" pt={ isMd ? "40px" : "25px"} w="100%">
              <HowItWorks />
            </Box>


            {/* About Us Section */}
            <Box component="section" pt="40px">
              <AboutUs />
            </Box>


            {/* Contact Section */}
            <Box component="section" pt="40px" pb="64px">
              <Text fw={700} size="30px">
                Contact Us
              </Text>
            </Box>

          </Stack>
        </Box>
      </Box>
    </ScrollArea>
  );
}