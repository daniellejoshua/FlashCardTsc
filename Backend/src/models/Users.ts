import bcrypt from "bcryptjs";
import { sql } from "../config/db.js";

export async function createUser(
  username: string,
  password: string,
  email: string,
) {
  const hashed_password = await bcrypt.hash(password, 10);

  const [user] = await sql`INSERT INTO users (username,hashed_password, email)
  VALUES (${username}, ${hashed_password}, ${email}) RETURNING id,username,email,created_at
   `;
  return user;
}
