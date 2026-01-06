import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Manually load the environment file
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // This will now correctly find the URL from your .env.local
    url: process.env.DATABASE_URL, 
  },
});