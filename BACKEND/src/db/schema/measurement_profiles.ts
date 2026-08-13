import { pgTable } from "drizzle-orm/pg-core/table";
import { uuid, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";


export const measurement_profiles = pgTable(
  "measurement_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    measurements: json("measurements").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);