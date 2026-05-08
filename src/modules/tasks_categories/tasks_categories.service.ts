import { db } from "@/db/connection";
import { tasksCategories } from "@/db/schema/tasks_categories.schema";

export class TasksCategoriesService {
  static async create(
    values: Array<{ category_id: string; task_id: string }>,
    tx: any = db,
  ) {
    return await tx.insert(tasksCategories).values(values).returning();
  }
}
