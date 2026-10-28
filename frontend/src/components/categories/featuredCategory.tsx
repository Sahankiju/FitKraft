import { Card, Image, Text, Group} from "@mantine/core";

import shirtImage from "../../assets/Image/Shirts.avif";
import pantsImage from "../../assets/Image/Pants.avif";
import coatImage from "../../assets/Image/Suits.avif";
import suitImage from "../../assets/Image/Blazers.avif";
import sareeImage from "../../assets/Image/Kurta.avif";
import traditionalImage from "../../assets/Image/Dresses.avif";

const categories = [
  { name: "Shirts", image: shirtImage },
  { name: "Pants", image: pantsImage },
  { name: "Suits", image: coatImage },
  { name: "Blazers", image: suitImage },
  { name: "Kurtas", image: sareeImage },
  { name: "Dresses", image: traditionalImage },
];

export function FeaturedCategories() {
  return (
    <Group justify="space-between" align="center" w="100%" mt={{ base: 20, md: 30 }} >
      {categories.map((category) => (
        <Card  key={category.name} radius="md" bg="var(--bg) ">
          <Card.Section>
            <Image src={category.image} h={{ base: 100, md: 180 }}  />
          </Card.Section>
          <Text fw={{ base: 250, md: 400 }} fz={{ base: "xs", md: "md" }} ta="center" mt="xs">
            {category.name}
          </Text>
        </Card>
      ))}
    </Group>
  );
}