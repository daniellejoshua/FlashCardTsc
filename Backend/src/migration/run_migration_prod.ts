import dotenv from "dotenv";
dotenv.config();

import { UserTable } from "./001-users-table.js";
import { topicTable } from "./002-create-topic.js";
import { flashCardTable } from "./003-create-flashcard.js";

export async function runProdDb() {
  await UserTable();
  await topicTable();
  await flashCardTable();
}
runProdDb().catch(console.error);
