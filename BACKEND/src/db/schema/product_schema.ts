import { pgTable, boolean,varchar, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { category } from "./category_schema";



export const product = pgTable(
  "product",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    price: integer("price").notNull(),
    thumbnail: varchar("thumbnail", { length: 256 }),
    category_id: varchar("category_id", { length: 256 }).notNull()
    .references(() => category.id, { onDelete: "cascade" }),
    is_active: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);