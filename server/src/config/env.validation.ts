// Zod schema for validating environment variables.
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;
