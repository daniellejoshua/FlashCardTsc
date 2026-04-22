import { sql } from "../config/db.js";
import { getErrorMessage } from "../helpers/errorMessage.js";
export async function UserTable() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      email varchar (255) NOT NULL UNIQUE,
      username varchar (255) NOT NULL UNIQUE,
      hashed_password varchar (255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
    console.log("Users Table Migrated Successfully");
  } catch (error) {
    const message = getErrorMessage(error);

    console.log("ERROR ON USERS MIGRATIONS", message);
  }
}
