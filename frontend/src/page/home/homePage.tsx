import {
  ScrollArea,
  Stack,
  Group,
  Badge,
  Text,
  Box,
  Anchor,
  Divider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FeaturedCategories } from "../../components/categories/featuredCategory";
import HowItWorks from "../../components/site/howItWorks";
import AboutUs from "../about/aboutUs";
import HeroSection from "../../components/site/heroSection";
import BestSeller from "../../components/categories/bestSeller";
// import classes from "./homePage.module.css";

export default function HomePage() {
  const isMd = useMediaQuery("(min-width: 768px)");
  return (
    <ScrollArea
      h={{ base: "calc(100% - 50px)", md: "calc(100% - 70px)" }}
      mt={{ base: "50px", md: "70px" }}
      w="100%"
      >
      <Box w="85%" mx="auto" h="100%">
        <Box w="100%">
          <Stack gap={0} w="100%">

            {/* Hero Section */}
            <HeroSection />

            {/* Featured Categories Section */}
            <Box component="section" pt={ isMd ? "50px" : "25px"} w="100%">
              <Stack gap={0}  w="100%">
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
            <Box component="section"  pt={ isMd ? "50px" : "25px"} w="100%">
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
                <BestSeller/>
              </Stack>
            </Box>

            {/* How It Works Section */}
            <Box component="section" pt={ isMd ? "50px" : "25px"} w="100%" id="howitworks">
              <HowItWorks />
            </Box>


            {/* About Us Section */}
            <Box component="section" pt={ isMd ? "50px" : "25px"} w="100%">
              <AboutUs />
            </Box>
          </Stack>
        </Box>
      </Box>
      {/* footer */}
            <Box component="section" pt={isMd ? "50px" : "25px"} w="100%">
              <Divider w="100%"/>
              <Group
                  h={isMd ? "50px" : "25px"}
                  align="center"
                  justify="space-between"
                  c="var(--muted)"
                  w="85%" mx="auto"
              >
                  <Text fz={{ base: "12px", md: "14px" }}>© 2026 FitKraft · Custom tailoring, delivered across Nepal</Text>
                  <Text fz={{ base: "12px", md: "14px" }}>eSewa · Khalti · Cash on delivery</Text>
              </Group>
          </Box>
    </ScrollArea>
  );
}