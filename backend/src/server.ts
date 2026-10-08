import express from "express";
import notesRouter from "./modules/notes.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "QuickNoteAPI is running" });
});

app.use("/api/notes", notesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
