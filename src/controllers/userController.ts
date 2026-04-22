import type { RequestHandler } from "express";
import { createUser } from "../models/Users.js";
import { getErrorMessage } from "../helpers/errorMessage.js";
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await createUser(username, password, email);
    res.status(200).json(user);
  } catch (error) {
    const message = getErrorMessage(error);
    res.status(400).json(message);
  }
};
