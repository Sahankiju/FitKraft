import { z } from "zod";

export const createCategorySchema = z.object({
  id: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  description: z.string().max(256).optional(),
});

export type CreateCategory = z.infer<typeof createCategorySchema>;