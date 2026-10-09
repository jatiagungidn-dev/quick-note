import { z } from "zod";

export const createNoteSchema = z.object({
  content: z.string().trim().min(1, "Content cannot be empty").max(255),
});

export const updateNoteSchema = z.object({
  content: z.string().trim().min(1, "Content cannot be empty").max(255),
});
