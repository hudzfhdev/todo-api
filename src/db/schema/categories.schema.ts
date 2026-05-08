import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { baseSchema } from "./base.schema";
import { relations } from "drizzle-orm";
import { tasksCategories } from "./tasks_categories.schema";

export const categories = pgTable("categories", {
  ...baseSchema,
  name: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 255 }),
});

export const categoriesRelations = relations(categories, (r) => ({
  taskCategories: r.many(tasksCategories),
}));
