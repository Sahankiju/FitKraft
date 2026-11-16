
import {
  ScrollArea,
  Stack,
  Group,
  Text,
  Box,
  Anchor,
  Title
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FeaturedCategories } from "../../components/categories/featuredCategory";
import HowItWorks from "../../components/site/howItWorks";
import AboutUs from "../about/aboutUs";
import HeroSection from "../../components/site/heroSection";
import BestSeller from "../../components/categories/bestSeller";

export default function HomePage() {
  const isMd = useMediaQuery("(min-width: 768px)");

  return (
    <ScrollArea w="100%" h="100%">
      <Box w="85%" mx="auto">
        <Stack gap={0} w="100%">

          {/* Hero Section */}
          <HeroSection />

          {/* Featured Categories Section */}
          <Box component="section" pt={isMd ? "50px" : "25px"} w="100%">
            <Stack gap={0} w="100%">
              <Text c="dimmed" size={isMd ? "md" : "10px"}>
                Browse By
              </Text>

              <Group justify="flex-start" align="center">
                <Title fw={{ base: 600, md: 700 }} fz={{ base: "20px", md: "30px" }}>
                  Featured Categories
                </Title>
              </Group>

              <FeaturedCategories />
            </Stack>
          </Box>

          {/* Featured Products Section */}
          <Box component="section" pt={isMd ? "50px" : "25px"} w="100%">
            <Stack gap={isMd ? 10 : 0} w="100%">
              <Group justify="space-between" align="center">
                <Title fw={{ base: 600, md: 700 }} fz={{ base: "20px", md: "30px" }}>
                  Featured Products
                </Title>

                <Anchor href="" underline="always" size={isMd ? "md" : "10px"}>
                  See All
                </Anchor>
              </Group>

              <BestSeller />
            </Stack>
          </Box>

          {/* How It Works Section */}
          <Box component="section" pt={isMd ? "50px" : "25px"} w="100%" id="howitworks">
            <HowItWorks />
          </Box>

          {/* About Us Section */}
          <Box component="section" pt={isMd ? "50px" : "25px"} w="100%">
            <AboutUs />
          </Box>
        </Stack>
      </Box>      
    </ScrollArea>
  );
}
