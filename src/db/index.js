import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This uses the DATABASE_URL from your .env.local
const sql = neon(process.env.DATABASE_URL);

// We export the db object with the schema attached for easier queries
export const db = drizzle(sql, { schema });