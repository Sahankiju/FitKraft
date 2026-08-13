import { pgTable } from "drizzle-orm/pg-core/table";
import { uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { customisation_group } from "./customisation_group";


export const customisation_option = pgTable(
    "customisation_option",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        group_id: uuid("group_id").notNull()
        .references(() => customisation_group.id, { onDelete: "cascade" }),
        name: varchar("name", { length: 256 }).notNull(),
        price_modifier: integer("price_modifier").notNull().default(0),
        is_active: boolean("is_active").default(true).notNull(),
        thumbnail: varchar("thumbnail", { length: 256 }),
    });