import { z } from "zod";

export const uuidParamsSchema = z.object({ id: z.uuid() });
