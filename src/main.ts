import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { cors } from "@elysia/cors";
import { tasksController } from "@/modules/tasks/tasks.controller";
import { openapi } from "@elysia/openapi";
import { ENV } from "./lib/environment";
import { logixlysia } from "logixlysia";
import { categoriesController } from "./modules/categories/categories.controller";

const server = new Elysia({ adapter: node() })
  .use(cors())
  .use(openapi())
  .use(
    logixlysia({
      config: {
        customLogFormat:
          "{now} {level} {duration} {method} {pathname} {status}",
      },
    }),
  )
  .use(tasksController)
  .use(categoriesController)
  .get("/", () => {
    return { status: "success", message: "hello" };
  })
  .listen(ENV.PORT);

export default server;
