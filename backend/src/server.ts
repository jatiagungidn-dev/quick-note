import express from "express";
import notesRouter from "./modules/notes.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import { env } from "./config/env.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "QuickNoteAPI is running" });
});

app.use("/api/notes", notesRouter);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
