import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.NEON_CONNECTION_STRING;
if (!connectionString) {
  throw new Error("NEON CONNECTION STRING IS NOT SET");
}

export const sql = neon(connectionString);
