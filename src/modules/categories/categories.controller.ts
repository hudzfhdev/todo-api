import Elysia from "elysia";
import { createTasksSchema, tasks } from "@/db/schema/tasks.schema";
import { db } from "@/db/connection";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { CategoriesServices } from "./categories.service";
import { uuidParamsSchema } from "../shared/shared.model";
import { response } from "@/helpers/api";

export const categoriesController = new Elysia({ prefix: "/categories" })
  .get("/", async () => {
    const categories = await CategoriesServices.selectAll();
    return response({
      data: categories,
      pagination: { total: categories.length, offset: 0, page: 1 },
    });
  })
  .get(
    "/:id",
    async ({ params, status }) => {
      const categories = await CategoriesServices.selectById(params.id);
      if (!categories[0]) throw new Error("Category not found");
      return status("OK", response({ data: categories[0] }));
    },
    { params: uuidParamsSchema },
  )
  .post(
    "/",
    async ({ body, status }) => {
      const found = await CategoriesServices.selectByName(body.name);
      if (found.length) throw new Error("Same category existed already.");
      const created = await CategoriesServices.create(body);
      return status("OK", response({ data: created }));
    },
    {
      body: z.object({
        name: z.string().min(1),
        description: z.string().nullish(),
      }),
    },
  )
  .patch(
    "/:id",
    async ({ body, params, status }) => {
      const found = await CategoriesServices.selectById(params.id);
      if (!found[0])
        throw new Error("Category not found, nothing to be updated");
      const updated = await CategoriesServices.update(params.id, body);
      return status("OK", response({ data: updated }));
    },
    {
      params: uuidParamsSchema,
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
