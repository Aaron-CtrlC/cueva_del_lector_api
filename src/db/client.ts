import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../shared/config/env";
import { relations } from "./relations";

export const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle({ client: pool, relations });

export type Database = typeof db;
