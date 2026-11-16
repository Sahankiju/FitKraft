import { Card, Image, Text, Group, UnstyledButton} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import classes from "./categories.module.css"
import { categories } from "../../data/categories";

export function FeaturedCategories() {
  const navigate = useNavigate();
  const selectedCategory = (name: string) => {
    navigate(`/product?category=${encodeURIComponent(name)}`);
};
  return (
    <Group justify="space-between" align="center" w="100%" mt={{ base: 10, md: 20 }} >
      {categories.map((category) => (
        <UnstyledButton className={classes.category} onClick={() => selectedCategory(category.name)} >
          <Card  key={category.name} radius="md" bg="var(--bg) " className={classes.categoryCard} >
            <Card.Section className={classes.categoryImg}>
              <Image src={category.image} h={ 180 }  />
            </Card.Section>
            <Text fw={{ base: 250, md: 500 }} fz={{ base: "xs", md: "md" }} ta="center" mt="xs" className={classes.categoryName}>
              {category.name}
            </Text>
          </Card>
        </UnstyledButton>
      ))}
    </Group>
  );
}