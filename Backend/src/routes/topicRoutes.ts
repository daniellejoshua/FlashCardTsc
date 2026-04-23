import express from "express";
import { AuthToken } from "../middleware/authToken.js";
import { addTopic } from "../controllers/topicController.js";
const router = express.Router();

router.post("createToken", AuthToken, addTopic);
export default router;
