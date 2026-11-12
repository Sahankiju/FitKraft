
import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { product } from "./product_schema";

export const customisation_group = pgTable(
  "customisation_group",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 256 }).notNull(),

    // NULL = reusable global group
    // UUID = product-specific group
    product_id: uuid("product_id").references(
      () => product.id,
      { onDelete: "cascade" }
    ),

    // single or multiple
    selection_type: varchar("selection_type", { length: 20 })
      .notNull()
      .default("single"),

    min_selections: integer("min_selections").notNull().default(0),

    max_selections: integer("max_selections"),
  }
);
