import { z } from "zod";

export const createNoteSchema = z.object({
  id: z.coerce.number().int().positive(),
  content: z.string().trim().min(1, "Content cannot be empty").max(255),
  created_at: z.date(),
  updated_at: z.date(),
});

export const updateNoteSchema = z.object({
  content: z.string().trim().min(1, "Content cannot be empty").max(255),
});
