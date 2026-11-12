
import {
  pgTable,
  uuid,
  boolean,
  integer,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { product } from "./product_schema";
import { customisation_group } from "./customisation_group";

export const product_customisation = pgTable(
  "product_customisation",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    product_id: uuid("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),

    group_id: uuid("group_id")
      .notNull()
      .references(() => customisation_group.id, {
        onDelete: "cascade"
      }),

    required: boolean("required").notNull().default(false),

    display_order: integer("display_order").notNull().default(0)
  },
  (table) => [
    uniqueIndex("product_customisation_unique")
      .on(table.product_id, table.group_id)
  ]
);
