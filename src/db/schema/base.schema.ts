import { sql } from "drizzle-orm";
import { uuid, timestamp } from "drizzle-orm/pg-core";

export const baseSchema = {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp({ mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp({ mode: "string", withTimezone: true }).$onUpdate(
    () => sql`now()`,
  ),
};
