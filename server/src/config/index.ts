// Centralized application configuration loaded from environment variables.
import { envSchema } from './env.validation';
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const config = {
  port: parsedEnv.data.PORT,
  nodeEnv: parsedEnv.data.NODE_ENV,
  // Export other config values here
  // databaseUrl: parsedEnv.data.DATABASE_URL,
};
