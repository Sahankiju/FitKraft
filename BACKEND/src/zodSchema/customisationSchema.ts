
import { z } from "zod";

// 1. Create reusable or product-specific group
export const createCustomisationGroupSchema = z.object({
  name: z.string().trim().min(1).max(256),

  // Omit product_id for reusable groups
  product_id: z.string().uuid().optional(),

  selection_type: z.enum(["single", "multiple"]).default("single"),

  min_selections: z.number().int().nonnegative().default(0),

  max_selections: z.number().int().positive().nullable().optional(),
}).superRefine((data, ctx) => {
  if (
    data.max_selections !== undefined &&
    data.max_selections !== null &&
    data.min_selections > data.max_selections
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["max_selections"],
      message: "Maximum cannot be less than minimum"
    });
  }

  if (
    data.selection_type === "single" &&
    data.max_selections !== undefined &&
    data.max_selections !== null &&
    data.max_selections > 1
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["max_selections"],
      message: "Single selection cannot have maximum greater than 1"
    });
  }
});

// 2. Attach existing group to product
export const attachCustomisationGroupSchema = z.object({
  group_id: z.string().uuid(),

  required: z.boolean().default(false),

  display_order: z.number().int().nonnegative().default(0)
});

// 3. Create an option
export const createCustomisationOptionSchema = z.object({
  name: z.string().trim().min(1).max(256),

  price_modifier: z.number().int().default(0),

  thumbnail: z.string().url().optional()
});

// 4. Update an existing option
export const updateCustomisationOptionSchema = z.object({
  name: z.string().trim().min(1).max(256).optional(),

  price_modifier: z.number().int().optional(),

  thumbnail: z.string().url().nullable().optional(),

  is_active: z.boolean().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

// 5. Update group settings
export const updateCustomisationGroupSchema = z.object({
  name: z.string().trim().min(1).max(256).optional(),

  selection_type: z.enum(["single", "multiple"]).optional(),

  min_selections: z.number().int().nonnegative().optional(),

  max_selections: z.number().int().positive().nullable().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);


export type CreateCustomisationGroup = z.infer<
  typeof createCustomisationGroupSchema
>;

export type AttachCustomisationGroup = z.infer<
  typeof attachCustomisationGroupSchema
>;

export type CreateCustomisationOption = z.infer<
  typeof createCustomisationOptionSchema
>;

export type UpdateCustomisationOption = z.infer<
  typeof updateCustomisationOptionSchema
>;

export type UpdateCustomisationGroup = z.infer<
  typeof updateCustomisationGroupSchema
>;