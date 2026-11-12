
import { pgTable, uuid, varchar, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { customisation_group } from "./customisation_group";

export const customisation_option = pgTable(
  "customisation_option",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    group_id: uuid("group_id")
      .notNull()
      .references(() => customisation_group.id, {
        onDelete: "cascade"
      }),

    name: varchar("name", { length: 256 }).notNull(),

    price_modifier: integer("price_modifier")
      .notNull()
      .default(0),

    is_active: boolean("is_active")
      .notNull()
      .default(true),

    thumbnail: varchar("thumbnail", { length: 512 }),
  },
  (table) => [
    uniqueIndex("customisation_option_group_name_unique")
      .on(table.group_id, table.name)
  ]
);
