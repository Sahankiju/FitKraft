import {
  ScrollArea,
  Stack,
  Group,
  Badge,
  Text,
  Divider,
  Box,
  Button,
  Anchor,
  // Card,
  // Image,
} from "@mantine/core";
import image from "../../assets/Image/landingPage.avif";
import { FeaturedCategories } from "../../components/categories/featuredCategory";  


export default function HomePage() {
  return (
    <ScrollArea h="calc(100vh - 70px)" mt="70px" w="100vw">
      <Box className="w-full">
        <Box className="px-1 md:px-5 w-full  bg-gray-100">
          <Stack gap={0}>
            <section className="w-full md:h-150 ">
              <Group align="center" justify="space-between" wrap="wrap" className="w-full h-full" >
                <Stack gap="xl" className=" md:w-120">
                  <Badge color="blue"> *  Now available in Nepal</Badge>

                  <Text fw={800} size="60px" className="font-(--sans)">
                    Design Your Perfect Outfit.
                  </Text>

                  <Text c="dimmed">
                    Custom tailoring, redefined for the digital age. Choose your
                    design, set your measurements, and receive a garment made
                    precisely for you.
                  </Text>

                  <Button size="md" className="mt-2 w-fit">
                    Browse Designs
                  </Button>
                </Stack>
                <img src={image} alt="landing page" className="w-1/2 h-full" />
              </Group>
            </section>
            <Divider />
            {/* Featured Categories Section */}
            <section className="pt-10">
              <Stack gap={10}>
                <Text c="dimmed" size="sm">
                  Browse By
                </Text>
                <Group justify="space-between" align="center">
                  <Text fw={700} size="30px">
                    Featured Categories
                  </Text>
                  <Anchor href="" underline="always">
                    View All
                  </Anchor>
                </Group>
                <FeaturedCategories />
              </Stack>
            </section>

            <Divider />

            {/* Featured Products Section */}
            <section className="pt-10">
              <Stack gap={40}>
                <Group justify="space-between" align="center">
                  <Text fw={700} size="30px">
                    Featured Products
                  </Text>
                  <Badge size="sm" variant="gradient"  gradient={{ from: 'blue', to: 'cyan', deg: 90 }} >
                      Best Seller
                  </Badge>
                </Group>
              </Stack>
            </section>

            <Divider />

            {/* How It Works Section */}
            <section className="pt-10">
              <Text fw={700} size="30px">
                How It Works
              </Text>
            </section>

            <Divider />

            {/* About Us Section */}
            <section className="pt-10">
              <Text fw={700} size="30px">
                About Us
              </Text>
            </section>

            <Divider />

            {/* Contact Section */}
            <section className="pt-10 pb-16">
              <Text fw={700} size="30px">
                Contact Us
              </Text>
            </section>
          </Stack>
        </Box>
      </Box>
    </ScrollArea>
  );
}