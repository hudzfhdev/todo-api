import { config } from "@dotenvx/dotenvx";
import { expand } from "dotenv-expand";

expand(config());

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "DEVELOPMENT",
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
} as const;
