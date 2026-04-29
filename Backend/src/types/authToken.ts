import type { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  user_id: number;
  username: string;
}

export interface AuthLocals {
  authUser: TokenPayload;
}
