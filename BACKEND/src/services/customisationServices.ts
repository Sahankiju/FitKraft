import {
  createCustomisationGroup as createGroupRepository,
  getCustomisationGroupById,
  getReusableCustomisationGroups as getReusableGroupsRepository,
  attachCustomisationGroup as attachGroupRepository,
  detachCustomisationGroup as detachGroupRepository,
  createCustomisationOption as createOptionRepository,
  updateCustomisationOption as updateOptionRepository,
  deleteCustomisationOption as deleteOptionRepository,
  updateCustomisationGroupLocked,
  getProductCustomisations as getProductCustomisationsRepository,
  deleteCustomisationGroup as deleteGroupRepository,
  getAllCustomisationGroups as getAllGroupsRepository,
  updateProductCustomisation as updateProductCustomisationRepository,
  getProductsUsingCustomisationGroup,
} from "../repositories/customisationRepository";

import { applyGroupUpdate } from "../zodSchema/customisationSchema";

import type {
  CreateCustomisationGroup,
  AttachCustomisationGroup,
  CreateCustomisationOption,
  UpdateCustomisationOption,
  UpdateCustomisationGroup,
  CustomisationGroupRow,
  SelectionType,
} from "../zodSchema/customisationSchema";


/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";

// Drizzle / drivers may wrap the original error in `cause`.
const getPgErrorCode = (err: unknown): string | undefined => {
  let current: unknown = err;

  for (let depth = 0; depth < 3 && current; depth++) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string") return code;
    current = (current as { cause?: unknown }).cause;
  }

  return undefined;
};

// Removes keys that are explicitly undefined so they cannot overwrite data.
const stripUndefined = <T extends Record<string, unknown>>(
  data: T
): Partial<T> =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>;

const requireNonEmpty = (patch: Record<string, unknown>) => {
  if (Object.keys(patch).length === 0) {
    throw new Error("At least one field must be provided");
  }
};

/* -------------------------------------------------------------------------- */
/* 1. CREATE CUSTOMISATION GROUP                                              */
/* -------------------------------------------------------------------------- */

export const createCustomisationGroup = async (
  data: CreateCustomisationGroup
) => {
  try {
    return await createGroupRepository(data);
  } catch (err) {
    // product_id points to a product that does not exist
    if (getPgErrorCode(err) === PG_FOREIGN_KEY_VIOLATION) {
      throw new Error("Product not found");
    }
    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/* 2. GET CUSTOMISATION GROUP BY ID                                           */
/* -------------------------------------------------------------------------- */

export const getCustomisationGroup = async (groupId: string) => {
  const group = await getCustomisationGroupById(groupId);

  if (!group) throw new Error("Customisation group not found");

  return group;
};

/* -------------------------------------------------------------------------- */
/* 3. GET REUSABLE CUSTOMISATION GROUPS                                       */
/* -------------------------------------------------------------------------- */

export const getReusableCustomisationGroups = async () => {
  return await getReusableGroupsRepository();
};

/* -------------------------------------------------------------------------- */
/* 4. ATTACH CUSTOMISATION GROUP TO PRODUCT                                   */
/* -------------------------------------------------------------------------- */

export const attachCustomisationGroup = async (
  productId: string,
  data: AttachCustomisationGroup
) => {
  const group = await getCustomisationGroupById(data.group_id);

  if (!group) throw new Error("Customisation group not found");

  // Reusable groups can be attached to any product.
  // Product-specific groups can only be attached to their own product.
  if (group.product_id !== null && group.product_id !== productId) {
    throw new Error(
      "This customisation group belongs to another product"
    );
  }

  try {
    return await attachGroupRepository(productId, data);
  } catch (err) {
    const code = getPgErrorCode(err);

    // Needs a unique index on (product_id, group_id)
    if (code === PG_UNIQUE_VIOLATION) {
      throw new Error("This group is already attached to the product");
    }

    // The group was checked above, so a bad FK means the product is missing
    if (code === PG_FOREIGN_KEY_VIOLATION) {
      throw new Error("Product not found");
    }

    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/* 5. DETACH CUSTOMISATION GROUP FROM PRODUCT                                 */
/* -------------------------------------------------------------------------- */

export const detachCustomisationGroup = async (
  productId: string,
  groupId: string
) => {
  const detached = await detachGroupRepository(productId, groupId);

  if (!detached) throw new Error("Product customisation not found");

  return detached;
};

/* -------------------------------------------------------------------------- */
/* 6. CREATE CUSTOMISATION OPTION                                             */
/* -------------------------------------------------------------------------- */

export const createCustomisationOption = async (
  groupId: string,
  data: CreateCustomisationOption
) => {
  const group = await getCustomisationGroupById(groupId);

  if (!group) throw new Error("Customisation group not found");

  return await createOptionRepository(groupId, data);
};

/* -------------------------------------------------------------------------- */
/* 7. UPDATE CUSTOMISATION OPTION                                             */
/* -------------------------------------------------------------------------- */

export const updateCustomisationOption = async (
  optionId: string,
  data: UpdateCustomisationOption
) => {
  const patch = stripUndefined(data);
  requireNonEmpty(patch);

  const updatedOption = await updateOptionRepository(optionId, patch);

  if (!updatedOption) throw new Error("Customisation option not found");

  return updatedOption;
};

/* -------------------------------------------------------------------------- */
/* 8. DELETE CUSTOMISATION OPTION (soft delete)                               */
/* -------------------------------------------------------------------------- */

export const deleteCustomisationOption = async (optionId: string) => {
  const deletedOption = await deleteOptionRepository(optionId);

  if (!deletedOption) throw new Error("Customisation option not found");

  return deletedOption;
};

/* -------------------------------------------------------------------------- */
/* 9. UPDATE CUSTOMISATION GROUP                                              */
/* -------------------------------------------------------------------------- */

export const updateCustomisationGroup = async (
  groupId: string,
  data: UpdateCustomisationGroup
) => {
  const patch = stripUndefined(data);
  requireNonEmpty(patch);

  const updated = await updateCustomisationGroupLocked(
    groupId,
    (existing) => {
      // Only the fields the rules know about, not the whole DB row.
      const row: CustomisationGroupRow = {
        id: existing.id,
        name: existing.name,
        selection_type: existing.selection_type as SelectionType,
        min_selections: existing.min_selections ?? 0,
        max_selections: existing.max_selections ?? null,
      };

      // Merge the patch onto the stored values, then validate the RESULT.
      const result = applyGroupUpdate(row, patch);

      if (!result.success) {
        throw new Error(
          "Invalid customisation group rules: " +
            result.issues
              .map((issue) => `${issue.path}: ${issue.message}`)
              .join(", ")
        );
      }

      // Only the requested changes are written.
      return patch;
    }
  );

  if (!updated) throw new Error("Customisation group not found");

  return updated;
};

/* -------------------------------------------------------------------------- */
/* 10. GET PRODUCT CUSTOMISATIONS WITH OPTIONS                                */
/* -------------------------------------------------------------------------- */

export const getProductCustomisations = async (productId: string) => {
  return await getProductCustomisationsRepository(productId);
};

/* -------------------------------------------------------------------------- */
/* 11. DELETE CUSTOMISATION GROUP                                             */
/* -------------------------------------------------------------------------- */

export const deleteCustomisationGroup = async (groupId: string) => {
  const group = await getCustomisationGroupById(groupId);

  if (!group) throw new Error("Customisation group not found");

  // Friendly early check. The foreign key (ON DELETE RESTRICT) is the
  // real guard against a product being attached between check and delete.
  const productsUsingGroup =
    await getProductsUsingCustomisationGroup(groupId);

  if (productsUsingGroup.length > 0) {
    throw new Error(
      "Cannot delete this group. Detach it from all products first."
    );
  }

  try {
    const deleted = await deleteGroupRepository(groupId);

    if (!deleted) throw new Error("Customisation group not found");

    return deleted;
  } catch (err) {
    if (getPgErrorCode(err) === PG_FOREIGN_KEY_VIOLATION) {
      throw new Error(
        "Cannot delete this group. Detach it from all products first."
      );
    }
    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/* 12. GET ALL CUSTOMISATION GROUPS                                           */
/* -------------------------------------------------------------------------- */

export const getAllCustomisationGroups = async () => {
  return await getAllGroupsRepository();
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
  const patch = stripUndefined(data);
  requireNonEmpty(patch);

  // The repository matches on (product_id, group_id), so a missing link
  // returns null. No extra group lookup or ownership check is needed.
  const updated = await updateProductCustomisationRepository(
    productId,
    groupId,
    patch
  );

  if (!updated) throw new Error("Product customisation not found");

  return updated;
};

/* -------------------------------------------------------------------------- */
/* 14. GET PRODUCTS USING A CUSTOMISATION GROUP                               */
/* -------------------------------------------------------------------------- */

export const getProductsUsingCustomisationGroupService = async (
  groupId: string
) => {
  const group = await getCustomisationGroupById(groupId);

  if (!group) throw new Error("Customisation group not found");

  return await getProductsUsingCustomisationGroup(groupId);
};