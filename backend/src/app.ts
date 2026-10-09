import express from "express";
import notesRouter from "./modules/notes.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "QuickNote API is running" });
});

app.use("/api/notes", notesRouter);

app.use(errorHandler);

export default app;
