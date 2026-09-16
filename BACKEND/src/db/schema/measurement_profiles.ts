import { pgTable } from "drizzle-orm/pg-core/table";
import { uuid, varchar, integer, boolean, timestamp, json, text } from "drizzle-orm/pg-core";
import { user } from "./schema";


export const measurement_profiles = pgTable(
  "measurement_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id").notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
    measurements: json("measurements").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);