import type { RequestHandler } from "express";
import { createUser } from "../models/Users.js";
import { getErrorMessage } from "../helpers/errorMessage.js";
import type { JwtPayload } from "jsonwebtoken";

import { sql } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface TokenPayload extends JwtPayload {
  user_id: number;
  username: string;
}

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  identifier: string;
  password: string;
}

type RegisterHandler = RequestHandler<{}, any, RegisterBody>;
type LoginHandler = RequestHandler<{}, any, LoginBody>;

export const registerUser: RegisterHandler = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await createUser(username, password, email);
    res.status(200).json(user);
  } catch (error) {
    const message = getErrorMessage(error);
    res.status(400).json(message);
  }
};

export const authUser: LoginHandler = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const [user] =
      await sql`SELECT * FROM users WHERE username = ${identifier} OR email = ${identifier}`;
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword)
      return res.status(403).json({ message: "Invalid Credentials" });

    const oldRefreshToken = req.cookies?.refreshToken;
    const oldAccessToken = req.cookies?.accessToken;

    if (oldAccessToken || oldRefreshToken) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
    }

    const accessToken = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.ACCESS_TOKEN!,
      { expiresIn: "30s" },
    );

    const refreshToken = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.REFRESH_TOKEN!,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 1000, // 30 seconds
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Log in Successfully" });
  } catch (error) {
    return next(error);
  }
};

export const tokenRefresher: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: "No Token" });
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN!);
    if (typeof decoded === "string")
      return res
        .status(403)
        .json({ message: "Not authorize, Invalid refreshToken" });

    const payload = decoded as TokenPayload;
    const [user] = await sql`SELECT * FROM users WHERE id = ${payload.user_id}`;
    if (!user) return res.status(403).json({ message: "No user found" });

    const newAccessToken = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.ACCESS_TOKEN!,
      { expiresIn: "30s" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 1000,
    });

    res.status(200).json({ message: "Token Refreshed Successfully" });
  } catch (err) {
    return next(err);
  }
};

export const logOutUser: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;
  if (accessToken && refreshToken)
    return res.status(401).json({ message: "No Token" });
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Log out successfully" });
  } catch (error) {
    return next(error);
  }
};

export const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(400).json({ message: "No Token" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!);
    if (typeof decoded === "string") {
      return res.status(400).json({ message: "Invalid Token" });
    }
    return res.status(200).json({ valid: true });
  } catch (error) {
    return next(error);
  }
};
