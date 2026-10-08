import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(["test", "development", "production"]),
  DATABASE_PATH: z.string().min(1),
});

export const env = envSchema.parse(process.env);
