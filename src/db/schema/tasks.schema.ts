import { relations, sql } from "drizzle-orm";
import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { baseSchema } from "./base.schema";
import { tasksCategories } from "./tasks_categories.schema";

export const tasks = pgTable("tasks", {
  ...baseSchema,
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 500 }),
  status: varchar()
    .$type<"completed" | "pending">()
    .$default(() => "pending"),
});

export const createTasksSchema = createInsertSchema(tasks, {
  title: (schema) => schema.min(1),
});
export type CreateTasksSchemaType = z.infer<typeof createTasksSchema>;

export const updateTasksSchema = createUpdateSchema(tasks);
export type UpdateTasksSchemaType = z.infer<typeof createTasksSchema> & {
  status?: "pending" | "completed" | null;
};

export const tasksRelations = relations(tasks, ({ many }) => ({
  task_categories: many(tasksCategories),
}));
