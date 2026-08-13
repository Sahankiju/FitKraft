import { pgTable } from "drizzle-orm/pg-core/table";
import { uuid, varchar, integer } from "drizzle-orm/pg-core";
import { product } from "./product_schema";


export const product_images = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    product_id: uuid("product_id").notNull()
    .references(() => product.id, { onDelete: "cascade" }),
    image_url: varchar("image_url", { length: 256 }).notNull(),
    display_order: integer("display_order").notNull().default(0)
  }
);