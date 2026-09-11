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
    <Group justify="space-between" align="center" w="100%" mt={30} >
      {categories.map((category) => (
        <Card  key={category.name}>
          <Card.Section>
            <Image src={category.image} h={180}/>
          </Card.Section>
          <Text fw={400} size="md" ta="center" mt="xs">
            {category.name}
          </Text>
        </Card>
      ))}
    </Group>
  );
}