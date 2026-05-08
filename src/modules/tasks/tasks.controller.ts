import Elysia from "elysia";
import { createTasksSchema, tasks } from "@/db/schema/tasks.schema";
import { db } from "@/db/connection";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TaskService } from "./tasks.service";
import { uuidParamsSchema } from "../shared/shared.model";
import { response } from "@/helpers/api";

export const tasksController = new Elysia({ prefix: "/tasks" })
  .get("/", async () => {
    const tasks = await TaskService.selectWithRelations();
    return response({
      data: tasks,
      pagination: { total: tasks.length, offset: 0, page: 1 },
    });
  })
  .get(
    "/:id",
    async ({ params, status }) => {
      const task = await TaskService.selectWithRelations({ id: params.id });
      if (!task[0]) throw new Error("Task not found");
      return status("OK", response({ data: task[0] }));
    },
    { params: uuidParamsSchema },
  )
  .post(
    "/",
    async ({ body, status }) => {
      const created = await db.transaction(async (tx) => {
        const { category_ids, ...rest } = body;
        const _created = await TaskService.create(rest);
        if (category_ids && category_ids?.length) {
          await TaskService.relate(
            _created[0].id,
            {
              categories: { ids: category_ids },
            },
            tx,
          );
        }
        return _created[0];
      });
      return status("OK", response({ data: created }));
    },
    {
      body: createTasksSchema
        .pick({
          title: true,
          description: true,
          status: true,
        })
        .extend({ category_ids: z.array(z.string()).min(1).nullish() }),
    },
  )
  .patch(
    "/:id",
    async ({ body, params, status }) => {
      const found = await TaskService.selectById(params.id);
      if (!found[0]) throw new Error("Task not found, nothing to be updated");
      const updated = await TaskService.update(params.id, body);
      return status("OK", response({ data: updated }));
    },
    {
      params: uuidParamsSchema,
      body: z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z
          .union([z.literal("completed"), z.literal("pending")])
          .optional(),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, status }) => {
      const deleted = await db.delete(tasks).where(eq(tasks.id, params.id));
      return status("OK", response({ data: deleted }));
    },
    { params: uuidParamsSchema },
  );
