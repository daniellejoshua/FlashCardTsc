import bcrypt from "bcryptjs";
import { sql } from "../config/db.js";

export async function createUser(
  username: string,
  password: string,
  email: string,
) {
  const hashed_password = await bcrypt.hash(password, 10);
  return await sql`INSERT INTO users (username,hashed_password, email)
  VALUES (${username}, ${hashed_password}, ${email}) RETURNING * `;
}
