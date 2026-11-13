import { db } from "../db/db_connection";

import { customisation_group } from "../db/schema/customisation_group";
import { customisation_option } from "../db/schema/customisation_option";
import { product_customisation } from "../db/schema/product_customisation";

import { eq, and, isNull, asc, inArray } from "drizzle-orm";

import type {
  CreateCustomisationGroup,
  AttachCustomisationGroup,
  CreateCustomisationOption,
  UpdateCustomisationOption,
  UpdateCustomisationGroup,
} from "../zodSchema/customisationSchema";

export type CustomisationGroupDbRow = typeof customisation_group.$inferSelect;

/* -------------------------------------------------------------------------- */
/* 1. CREATE CUSTOMISATION GROUP                                              */
/* -------------------------------------------------------------------------- */

export const createCustomisationGroup = async (
  data: CreateCustomisationGroup
) => {
  const result = await db
    .insert(customisation_group)
    .values(data)
    .returning();

  return result[0];
};

/* -------------------------------------------------------------------------- */
/* 2. GET CUSTOMISATION GROUP BY ID                                           */
/* -------------------------------------------------------------------------- */

export const getCustomisationGroupById = async (groupId: string) => {
  const result = await db
    .select()
    .from(customisation_group)
    .where(eq(customisation_group.id, groupId))
    .limit(1);

  return result[0] ?? null;
};

/* -------------------------------------------------------------------------- */
/* 3. GET REUSABLE CUSTOMISATION GROUPS                                       */
/* -------------------------------------------------------------------------- */

export const getReusableCustomisationGroups = async () => {
  return await db
    .select()
    .from(customisation_group)
    .where(isNull(customisation_group.product_id))
    .orderBy(asc(customisation_group.name));
};

/* -------------------------------------------------------------------------- */
/* 4. ATTACH CUSTOMISATION GROUP TO PRODUCT                                   */
/* -------------------------------------------------------------------------- */

export const attachCustomisationGroup = async (
  productId: string,
  data: AttachCustomisationGroup
) => {
  const result = await db
    .insert(product_customisation)
    .values({
      product_id: productId,
      group_id: data.group_id,
      required: data.required,
      display_order: data.display_order,
    })
    .returning();

  return result[0];
};

/* -------------------------------------------------------------------------- */
/* 5. DETACH CUSTOMISATION GROUP FROM PRODUCT                                 */
/* -------------------------------------------------------------------------- */

export const detachCustomisationGroup = async (
  productId: string,
  groupId: string
) => {
  const result = await db
    .delete(product_customisation)
    .where(
      and(
        eq(product_customisation.product_id, productId),
        eq(product_customisation.group_id, groupId)
      )
    )
    .returning();

  return result[0] ?? null;
};

/* -------------------------------------------------------------------------- */
/* 6. CREATE CUSTOMISATION OPTION                                             */
/* -------------------------------------------------------------------------- */

export const createCustomisationOption = async (
  groupId: string,
  data: CreateCustomisationOption
) => {
  const result = await db
    .insert(customisation_option)
    .values({
      group_id: groupId,
      name: data.name,
      price_modifier: data.price_modifier,
      thumbnail: data.thumbnail,
    })
    .returning();

  return result[0];
};

/* -------------------------------------------------------------------------- */
/* 7. UPDATE CUSTOMISATION OPTION                                             */
/* -------------------------------------------------------------------------- */

export const updateCustomisationOption = async (
  optionId: string,
  data: UpdateCustomisationOption
) => {
  const result = await db
    .update(customisation_option)
    .set(data)
    .where(eq(customisation_option.id, optionId))
    .returning();

  return result[0] ?? null;
};

/* -------------------------------------------------------------------------- */
/* 8. DELETE CUSTOMISATION OPTION (soft delete)                               */
/* -------------------------------------------------------------------------- */

// Past orders may reference this option, so it is deactivated rather than
// removed. getProductCustomisations already hides inactive options.
export const deleteCustomisationOption = async (optionId: string) => {
  const result = await db
    .update(customisation_option)
    .set({ is_active: false })
    .where(
      and(
        eq(customisation_option.id, optionId),
        eq(customisation_option.is_active, true)
      )
    )
    .returning();

  return result[0] ?? null;
};

/* -------------------------------------------------------------------------- */
/* 9. UPDATE CUSTOMISATION GROUP (row locked inside a transaction)            */
/* -------------------------------------------------------------------------- */

// Locks the row (SELECT ... FOR UPDATE), lets the caller validate the patch
// against the CURRENT stored values, then saves it. If buildPatch throws,
// the transaction rolls back. Two concurrent PATCHes cannot both pass
// validation against stale data.
export const updateCustomisationGroupLocked = async (
  groupId: string,
  buildPatch: (existing: CustomisationGroupDbRow) => UpdateCustomisationGroup
) => {
  return await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(customisation_group)
      .where(eq(customisation_group.id, groupId))
      .limit(1)
      .for("update");

    if (!existing) return null;

    const patch = buildPatch(existing);

    const [updated] = await tx
      .update(customisation_group)
      .set(patch)
      .where(eq(customisation_group.id, groupId))
      .returning();

    return updated ?? null;
  });
};

/* -------------------------------------------------------------------------- */
/* 10. GET PRODUCT CUSTOMISATIONS WITH OPTIONS (2 queries, no N+1)            */
/* -------------------------------------------------------------------------- */

export const getProductCustomisations = async (productId: string) => {
  const groups = await db
    .select({
      id: customisation_group.id,
      name: customisation_group.name,
      selection_type: customisation_group.selection_type,
      min_selections: customisation_group.min_selections,
      max_selections: customisation_group.max_selections,
      required: product_customisation.required,
      display_order: product_customisation.display_order,
    })
    .from(product_customisation)
    .innerJoin(
      customisation_group,
      eq(product_customisation.group_id, customisation_group.id)
    )
    .where(eq(product_customisation.product_id, productId))
    .orderBy(asc(product_customisation.display_order));

  if (groups.length === 0) return [];

  const options = await db
    .select({
      id: customisation_option.id,
      group_id: customisation_option.group_id,
      name: customisation_option.name,
      price_modifier: customisation_option.price_modifier,
      thumbnail: customisation_option.thumbnail,
      is_active: customisation_option.is_active,
    })
    .from(customisation_option)
    .where(
      and(
        inArray(
          customisation_option.group_id,
          groups.map((group) => group.id)
        ),
        eq(customisation_option.is_active, true)
      )
    )
    .orderBy(asc(customisation_option.name));

  type OptionWithoutGroup = Omit<(typeof options)[number], "group_id">;
  const optionsByGroup = new Map<string, OptionWithoutGroup[]>();

  for (const { group_id, ...option } of options) {
    const list = optionsByGroup.get(group_id) ?? [];
    list.push(option);
    optionsByGroup.set(group_id, list);
  }

  return groups.map((group) => ({
    ...group,
    options: optionsByGroup.get(group.id) ?? [],
  }));
};

/* -------------------------------------------------------------------------- */
/* 11. DELETE CUSTOMISATION GROUP                                             */
/* -------------------------------------------------------------------------- */

export const deleteCustomisationGroup = async (groupId: string) => {
  const result = await db
    .delete(customisation_group)
    .where(eq(customisation_group.id, groupId))
    .returning();

  return result[0] ?? null;
};

/* -------------------------------------------------------------------------- */
/* 12. GET ALL CUSTOMISATION GROUPS                                           */
/* -------------------------------------------------------------------------- */

export const getAllCustomisationGroups = async () => {
  return await db
    .select()
    .from(customisation_group)
    .orderBy(asc(customisation_group.name));
};

/* -------------------------------------------------------------------------- */
/* 13. UPDATE PRODUCT CUSTOMISATION                                           */
/* -------------------------------------------------------------------------- */

export const updateProductCustomisation = async (
  productId: string,
  groupId: string,
  data: {
    required?: boolean;
    display_order?: number;
  }
) => {
  const result = await db
    .update(product_customisation)
    .set(data)
    .where(
      and(
        eq(product_customisation.product_id, productId),
        eq(product_customisation.group_id, groupId)
      )
    )
    .returning();

  return result[0] ?? null;
};

/* -------------------------------------------------------------------------- */
/* 14. GET PRODUCTS USING A CUSTOMISATION GROUP                               */
/* -------------------------------------------------------------------------- */

export const getProductsUsingCustomisationGroup = async (
  groupId: string
) => {
  return await db
    .select({
      id: product_customisation.id,
      product_id: product_customisation.product_id,
      group_id: product_customisation.group_id,
      required: product_customisation.required,
      display_order: product_customisation.display_order,
    })
    .from(product_customisation)
    .where(eq(product_customisation.group_id, groupId))
    .orderBy(asc(product_customisation.display_order));
};