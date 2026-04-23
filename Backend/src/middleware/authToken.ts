import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
interface TokenPayload extends JwtPayload {
  user_id: number;
  username: string;
}
interface AuthLocals {
  authUser: TokenPayload;
}
export const AuthToken: RequestHandler<{}, any, any, any, AuthLocals> = async (
  req,
  res,
  next,
) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token)
      return res.status(403).json({ message: "You are not Authorize" });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!);
    if (typeof decoded === "string")
      return res
        .status(403)
        .json({ message: "Not authorize, Invalid AccessToken" });
    const payload = decoded as TokenPayload;
    res.locals.authUser = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};
