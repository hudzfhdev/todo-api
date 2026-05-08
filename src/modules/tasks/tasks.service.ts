import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import {
  CreateTasksSchemaType,
  tasks,
  UpdateTasksSchemaType,
} from "../../db/schema/tasks.schema";
import { TasksCategoriesService } from "../tasks_categories/tasks_categories.service";

export class TaskService {
  static async selectAll() {
    return await db.select().from(tasks);
  }

  static async selectWithRelations(filter?: Record<"id", string>) {
    return await db.query.tasks.findMany({
      where: filter?.id ? eq(tasks.id, filter.id) : undefined,
      with: {
        task_categories: {
          columns: {},
          with: {
            category: { columns: { id: true, name: true, description: true } },
          },
        },
      },
    });
  }

  static async selectById(id: string) {
    return await db.select().from(tasks).where(eq(tasks.id, id));
  }

  static async create(values: CreateTasksSchemaType) {
    const created = await db
      .insert(tasks)
      .values({ ...values, status: "pending" })
      .returning();
    return created;
  }

  static async relate(
    task_id: string,
    relations: { categories: { ids: string[] } },
    tx: any = db,
  ) {
    return await TasksCategoriesService.create(
      relations.categories.ids.map((id) => ({ category_id: id, task_id })),
      tx,
    );
  }

  static async update(id: string, values: UpdateTasksSchemaType) {
    const updated = await db
      .update(tasks)
      .set({ ...values })
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  static async remove(id: string) {
    return await db.delete(tasks).where(eq(tasks.id, id));
  }
}
