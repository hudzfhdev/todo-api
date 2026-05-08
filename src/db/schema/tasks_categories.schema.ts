import { pgTable, uuid, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { baseSchema } from "./base.schema";
import { categories, tasks } from "./schema";
import { relations } from "drizzle-orm";

export const tasksCategories = pgTable(
  "tasks_categories",
  {
    category_id: uuid(),
    task_id: uuid(),
  },
  (table) => [
    primaryKey({
      columns: [table.category_id, table.task_id],
    }),
  ],
);

export const tasksCategoriesRelations = relations(tasksCategories, (r) => ({
  task: r.one(tasks, {
    fields: [tasksCategories.task_id],
    references: [tasks.id],
  }),
  category: r.one(categories, {
    fields: [tasksCategories.category_id],
    references: [categories.id],
  }),
}));
