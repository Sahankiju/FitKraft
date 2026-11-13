import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

// FIX 2: z.string().url() accepts anything the URL parser accepts,
// including "javascript:alert(1)". Only allow http(s).
const httpUrl = z
  .string()
  .url()
  .max(2048)
  .refine(
    (value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL must start with http:// or https://" }
  );

// Used by update schemas: true when at least one key carries a real value.
// Ignores keys that exist but are explicitly `undefined`.
const hasAtLeastOneField = (data: Record<string, unknown>) =>
  Object.values(data).some((value) => value !== undefined);

/* -------------------------------------------------------------------------- */
/* FIX 1: group rules in ONE place, reused by create AND update               */
/* -------------------------------------------------------------------------- */

export type SelectionType = "single" | "multiple";

export interface GroupRuleInput {
  selection_type: SelectionType;
  min_selections: number;
  max_selections?: number | null;
}

export interface GroupRuleIssue {
  path: "min_selections" | "max_selections";
  message: string;
}

export function validateGroupRules(group: GroupRuleInput): GroupRuleIssue[] {
  const issues: GroupRuleIssue[] = [];
  const max = group.max_selections;
  const hasMax = max !== undefined && max !== null;

  if (hasMax && group.min_selections > max) {
    issues.push({
      path: "max_selections",
      message: "Maximum cannot be less than minimum",
    });
  }

  if (group.selection_type === "single") {
    if (hasMax && max > 1) {
      issues.push({
        path: "max_selections",
        message: "Single selection cannot have maximum greater than 1",
      });
    }
    // Extra hole closed: single + no max + min of 5 passed before.
    if (group.min_selections > 1) {
      issues.push({
        path: "min_selections",
        message: "Single selection cannot have minimum greater than 1",
      });
    }
  }

  return issues;
}

/* -------------------------------------------------------------------------- */
/* 1. Create reusable or product-specific group                               */
/* -------------------------------------------------------------------------- */

export const createCustomisationGroupSchema = z
  .object({
    name: z.string().trim().min(1).max(256),

    // Omit product_id for reusable groups
    product_id: z.string().uuid().optional(),

    selection_type: z.enum(["single", "multiple"]).default("single"),

    min_selections: z.number().int().nonnegative().default(0),

    max_selections: z.number().int().positive().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    for (const issue of validateGroupRules(data)) {
      ctx.addIssue({
        code: "custom",
        path: [issue.path],
        message: issue.message,
      });
    }
  });

/* -------------------------------------------------------------------------- */
/* 2. Attach existing group to product                                        */
/* -------------------------------------------------------------------------- */

export const attachCustomisationGroupSchema = z.object({
  group_id: z.string().uuid(),

  required: z.boolean().default(false),

  display_order: z.number().int().nonnegative().default(0),
});

/* -------------------------------------------------------------------------- */
/* 3. Create an option                                                        */
/* -------------------------------------------------------------------------- */

export const createCustomisationOptionSchema = z.object({
  name: z.string().trim().min(1).max(256),

  // Minor units (cents / paisa). Negative = discount.
  price_modifier: z.number().int().default(0),

  thumbnail: httpUrl.optional(),
});

/* -------------------------------------------------------------------------- */
/* 4. Update an existing option                                               */
/* -------------------------------------------------------------------------- */

export const updateCustomisationOptionSchema = z
  .object({
    name: z.string().trim().min(1).max(256).optional(),

    price_modifier: z.number().int().optional(),

    // omitted = untouched, url = replace, null = remove
    thumbnail: httpUrl.nullable().optional(),

    is_active: z.boolean().optional(),
  })
  .refine(hasAtLeastOneField, {
    message: "At least one field must be provided",
  });

/* -------------------------------------------------------------------------- */
/* 5. Update group settings                                                   */
/* -------------------------------------------------------------------------- */

// This schema can only check fields in isolation: a partial PATCH cannot
// know the stored values. Cross-field rules run in applyGroupUpdate() below.
export const updateCustomisationGroupSchema = z
  .object({
    name: z.string().trim().min(1).max(256).optional(),

    selection_type: z.enum(["single", "multiple"]).optional(),

    min_selections: z.number().int().nonnegative().optional(),

    max_selections: z.number().int().positive().nullable().optional(),
  })
  .refine(hasAtLeastOneField, {
    message: "At least one field must be provided",
  });

export type UpdateCustomisationGroupInput = z.infer<
  typeof updateCustomisationGroupSchema
>;

export interface CustomisationGroupRow {
  id: string;
  name: string;
  selection_type: SelectionType;
  min_selections: number;
  max_selections: number | null;
}

export type ApplyGroupUpdateResult =
  | { success: true; data: CustomisationGroupRow }
  | { success: false; issues: GroupRuleIssue[] };

/**
 * Merge a validated PATCH onto the stored row, then re-check the
 * cross-field rules on the RESULT.
 *
 * Usage (inside a transaction, with the row locked, e.g. SELECT ... FOR UPDATE,
 * so two concurrent PATCHes cannot each pass against stale data):
 *
 *   const patch = updateCustomisationGroupSchema.parse(req.body);
 *   const row = await loadGroupForUpdate(id);
 *   const result = applyGroupUpdate(row, patch);
 *   if (!result.success) return res.status(400).json({ issues: result.issues });
 *   await saveGroup(result.data);
 */
export function applyGroupUpdate(
  existing: CustomisationGroupRow,
  patch: UpdateCustomisationGroupInput
): ApplyGroupUpdateResult {
  // Drop keys that are undefined so they cannot overwrite stored values.
  const definedPatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  ) as Partial<CustomisationGroupRow>;

  const merged: CustomisationGroupRow = { ...existing, ...definedPatch };

  const issues = validateGroupRules(merged);
  if (issues.length > 0) return { success: false, issues };

  return { success: true, data: merged };
}

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