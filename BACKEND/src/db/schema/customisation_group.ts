import { pgTable } from "drizzle-orm/pg-core/table";
import { uuid, varchar } from "drizzle-orm/pg-core";


export const customisation_group = pgTable(
  "customisation_group",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull()
});
