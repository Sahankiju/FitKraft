import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(256, "Product name must be at most 256 characters"),

  description: z
    .string()
    .max(256, "Description must be at most 256 characters")
    .optional(),

  price: z
    .number()
    .int("Price must be an integer")
    .positive("Price must be greater than 0"),

  thumbnail: z
    .string()
    .max(256)
    .optional(),

  category_id: z
    .string()
    .min(1, "Category ID is required"),
});

export type CreateProduct = z.infer<typeof createProductSchema>;