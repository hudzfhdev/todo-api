import { drizzle } from "drizzle-orm/node-postgres";
import { tasks, categories, tasksCategories } from "./schema/schema";
import { ENV } from "@/lib/environment";
import { categoriesRelations } from "./schema/categories.schema";
import { tasksCategoriesRelations } from "./schema/tasks_categories.schema";
import { tasksRelations } from "./schema/tasks.schema";

export const db = drizzle(ENV.DATABASE_URL!, {
  schema: {
    // table
    tasks,
    categories,
    tasksCategories,
    // relations
    tasksCategoriesRelations,
    tasksRelations,
    categoriesRelations,
  },
});
