import dotenv from "dotenv";
dotenv.config({ path: "./.env.test" });

import { UserTable } from "./001-users-table.js";
import { topicTable } from "./002-create-topic.js";
import { flashCardTable } from "./003-create-flashcard.js";

async function run() {
  await UserTable();
  await topicTable();
  await flashCardTable();
}

run().catch(console.error);
