import { describe, it, expect, vi, type Mock } from "vitest";

vi.mock("../config/db.js", () => ({
  sql: vi.fn(),
}));

import { createFlashcards } from "../models/Flashcards.js";
import { sql } from "../config/db.js";

describe("createFlashcards", () => {
  it("It returns empty array", async () => {
    const result = await createFlashcards([]);
    expect(result).toEqual([]);
  });
  it("it bulks insert", async () => {
    const dummyRows = [
      { id: 1, topic_id: 1, question: "Q1", answer: "A1", created_at: "now" },
    ];
    const sqlMock = sql as unknown as Mock;
    sqlMock.mockResolvedValue(dummyRows);
    const result = await createFlashcards([
      { topic_id: 1, question: "Q1", answer: "A1" },
    ]);

    expect(result).toEqual(dummyRows);
    expect(sqlMock).toHaveBeenCalled();
  });
});
