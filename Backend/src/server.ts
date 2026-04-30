import express from "express";

import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/topic", topicRoutes);

async function initializeDb() {
  try {
    console.log("DB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log("ERROR INITILIAZING DB", error);
  }
}

initializeDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server running on port 3000");
  });
});

export default app;
