import { integer, json, pgTable, timestamp, uuid ,text } from "drizzle-orm/pg-core";
import { product } from "./product_schema";
import { orders } from "./orders";



export const order_item = pgTable(
  "order_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    order_id: uuid("order_id").notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
    product_id: uuid("product_id").notNull()
    .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    unit_price: integer("unit_price").notNull(),
    sub_total: integer("sub_total").notNull(),
    measurement_profile_id: uuid("measurement_profile_id"),
    selected_costimisation:json("selected_costimisation").notNull(),
    note:text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);