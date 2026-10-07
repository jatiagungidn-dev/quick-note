import { Router } from "express";
import db from "../config/db.js";

const router = Router();

router.get("/", (_req, res) => {
  try {
    const notes = db
      .prepare(
        `
        SELECT
            id,
            content,
            created_at,
            updated_at
        FROM notes
        ORDER BY created_at DESC
    `,
      )
      .all();

    res.status(200).json({ count: notes.length, data: notes });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const note = db
      .prepare(
        `
        SELECT
            id,
            content,
            created_at,
            updated_at
        FROM notes
        WHERE id = ?
    `,
      )
      .get(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ data: note });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", (req, res) => {
  try {
    const { content } = req.body;

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const newNote = db
      .prepare(
        `
        INSERT INTO notes (content)
        VALUES (?)
        RETURNING id, content, created_at, updated_at
    `,
      )
      .get(content.trim());

    res.status(201).json({ message: "Note added successfully", data: newNote });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const { content } = req.body;

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const updates = [];
    const values = [];

    if (content !== undefined) {
      updates.push("content = ?");
      values.push(content.trim());
    }

    values.push(id);

    const updated = db
      .prepare(
        `
        UPDATE notes
        SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        RETURNING id, content, created_at, updated_at
    `,
      )
      .get(...values);

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note updated successfully", data: updated });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const deleted = db
      .prepare(
        `
        DELETE FROM notes
        WHERE id = ?
    `,
      )
      .run(id);

    if (deleted.changes === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note deleted successfully", changes: deleted.changes });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
