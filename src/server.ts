import express from "express";
import { UserTable } from "./migration/001-users-table.js";
import { topicTable } from "./migration/002-create-topic.js";
import { flashCardTable } from "./migration/003-create-flashcard.js";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

async function initializeDb() {
  try {
    console.log("DB CONNECTED SUCCESSFULLY");
    await UserTable();
    await topicTable();
    await flashCardTable();
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
