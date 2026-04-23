import express from "express";

const router = express.Router();

router.post("createToken", authToken, addTopic);
export default router;
