import { integer, varchar, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    total_amount: integer("total_amount").notNull(),
    status: varchar("status", { length: 256 }).notNull(),
    payment_status: varchar("payment_status", { length: 256 }).notNull(),
    shipping_address: varchar("shipping_address", { length: 256 }).notNull(),
    payment_method: varchar("payment_method", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);