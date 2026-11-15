
import type { Context } from "hono";
import { z } from "zod";

import {
  createCustomisationGroup,
  getCustomisationGroup,
  getReusableCustomisationGroups,
  attachCustomisationGroup,
  detachCustomisationGroup,
  createCustomisationOption,
  updateCustomisationOption,
  deleteCustomisationOption,
  updateCustomisationGroup,
  getProductCustomisations,
  deleteCustomisationGroup,
  getAllCustomisationGroups,
  updateProductCustomisation,
  getProductsUsingCustomisationGroupService,
  getCustomisationOptions,
} from "../services/customisationServices";

import {
  createCustomisationGroupSchema,
  attachCustomisationGroupSchema,
  createCustomisationOptionSchema,
  updateCustomisationOptionSchema,
  updateCustomisationGroupSchema,
} from "../zodSchema/customisationSchema";

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

const uuidSchema = z.string().uuid();

const getUuidParam = (c: Context, name: string) => {
  const value = c.req.param(name);
  const result = uuidSchema.safeParse(value);

  return result.success ? result.data : null;
};

const handleError = (c: Context, error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Internal server error";

  let status: 400 | 404 | 409 | 500 = 500;

  if (message.toLowerCase().includes("not found")) {
    status = 404;
  } else if (
    message.toLowerCase().includes("cannot delete") ||
    message.toLowerCase().includes("belongs to another product") ||
    message.toLowerCase().includes("already attached")
  ) {
    status = 409;
  } else if (
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("must") ||
    message.toLowerCase().includes("required")
  ) {
    status = 400;
  }

  return c.json({ message }, status);
};

/* -------------------------------------------------------------------------- */
/* 1. CREATE CUSTOMISATION GROUP                                              */
/* POST /customisation-groups                                                */
/* -------------------------------------------------------------------------- */

export const createCustomisationGroupController = async (c: Context) => {
  try {
    const body = await c.req.json();

    const validation =
      createCustomisationGroupSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        400
      );
    }

    const result = await createCustomisationGroup(validation.data);

    return c.json(
      {
        message: "Customisation group created successfully",
        data: result,
      },
      201
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 2. GET CUSTOMISATION GROUP BY ID                                           */
/* GET /customisation-groups/:groupId                                        */
/* -------------------------------------------------------------------------- */

export const getCustomisationGroupController = async (c: Context) => {
  try {
    const groupId = getUuidParam(c, "groupId");

    if (!groupId) {
      return c.json({ message: "Invalid group ID" }, 400);
    }

    const result = await getCustomisationGroup(groupId);

    return c.json(
      {
        message: "Customisation group retrieved successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 3. GET REUSABLE CUSTOMISATION GROUPS                                       */
/* GET /customisation-groups/reusable                                        */
/* -------------------------------------------------------------------------- */

export const getReusableCustomisationGroupsController = async (
  c: Context
) => {
  try {
    const result = await getReusableCustomisationGroups();

    return c.json(
      {
        message: "Reusable customisation groups retrieved successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 4. GET ALL CUSTOMISATION GROUPS                                            */
/* GET /customisation-groups                                                 */
/* -------------------------------------------------------------------------- */

export const getAllCustomisationGroupsController = async (
  c: Context
) => {
  try {
    const result = await getAllCustomisationGroups();

    return c.json(
      {
        message: "Customisation groups retrieved successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 5. ATTACH CUSTOMISATION GROUP TO PRODUCT                                   */
/* POST /products/:productId/customisations                                  */
/* -------------------------------------------------------------------------- */

export const attachCustomisationGroupController = async (c: Context) => {
  try {
    const productId = getUuidParam(c, "productId");

    if (!productId) {
      return c.json({ message: "Invalid product ID" }, 400);
    }

    const body = await c.req.json();

    const validation =
      attachCustomisationGroupSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        400
      );
    }

    const result = await attachCustomisationGroup(
      productId,
      validation.data
    );

    return c.json(
      {
        message: "Customisation group attached successfully",
        data: result,
      },
      201
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 6. DETACH CUSTOMISATION GROUP FROM PRODUCT                                 */
/* DELETE /products/:productId/customisations/:groupId                       */
/* -------------------------------------------------------------------------- */

export const detachCustomisationGroupController = async (
  c: Context
) => {
  try {
    const productId = getUuidParam(c, "productId");
    const groupId = getUuidParam(c, "groupId");

    if (!productId || !groupId) {
      return c.json(
        { message: "Invalid product ID or group ID" },
        400
      );
    }

    const result = await detachCustomisationGroup(
      productId,
      groupId
    );

    return c.json(
      {
        message: "Customisation group detached successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};



/* -------------------------------------------------------------------------- */
/* 7. get  CUSTOMISATION OPTION                                             */
/* GET /customisation-groups/:groupId/options                               */
/* -------------------------------------------------------------------------- */

export const getCustomisationOptionsController = async (c: Context) => {
  try {
    const groupId = getUuidParam(c, "groupId");

    if (!groupId) {
      return c.json({ message: "Invalid group ID" }, 400);
    }

    const result = await getCustomisationOptions(groupId);

    return c.json(
      {
        message: "Customisation options retrieved successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 8. CREATE CUSTOMISATION OPTION                                             */
/* POST /customisation-groups/:groupId/options                               */
/* -------------------------------------------------------------------------- */



export const createCustomisationOptionController = async (
  c: Context
) => {
  try {
    const groupId = getUuidParam(c, "groupId");

    if (!groupId) {
      return c.json({ message: "Invalid group ID" }, 400);
    }

    const body = await c.req.json();

    const validation =
      createCustomisationOptionSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        400
      );
    }

    const result = await createCustomisationOption(
      groupId,
      validation.data
    );

    return c.json(
      {
        message: "Customisation option created successfully",
        data: result,
      },
      201
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 9. UPDATE CUSTOMISATION OPTION                                             */
/* PATCH /customisation-options/:optionId                                   */
/* -------------------------------------------------------------------------- */

export const updateCustomisationOptionController = async (
  c: Context
) => {
  try {
    const optionId = getUuidParam(c, "optionId");

    if (!optionId) {
      return c.json({ message: "Invalid option ID" }, 400);
    }

    const body = await c.req.json();

    const validation =
      updateCustomisationOptionSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        400
      );
    }

    const result = await updateCustomisationOption(
      optionId,
      validation.data
    );

    return c.json(
      {
        message: "Customisation option updated successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 10. DELETE CUSTOMISATION OPTION                                             */
/* DELETE /customisation-options/:optionId                                  */
/* -------------------------------------------------------------------------- */

export const deleteCustomisationOptionController = async (
  c: Context
) => {
  try {
    const optionId = getUuidParam(c, "optionId");

    if (!optionId) {
      return c.json({ message: "Invalid option ID" }, 400);
    }

    const result = await deleteCustomisationOption(optionId);

    return c.json(
      {
        message: "Customisation option deleted successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 11. UPDATE CUSTOMISATION GROUP RULES                                       */
/* PATCH /customisation-groups/:groupId                                     */
/* -------------------------------------------------------------------------- */

export const updateCustomisationGroupController = async (
  c: Context
) => {
  try {
    const groupId = getUuidParam(c, "groupId");

    if (!groupId) {
      return c.json({ message: "Invalid group ID" }, 400);
    }

    const body = await c.req.json();

    const validation =
      updateCustomisationGroupSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        400
      );
    }

    const result = await updateCustomisationGroup(
      groupId,
      validation.data
    );

    return c.json(
      {
        message: "Customisation group updated successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 12. GET PRODUCT CUSTOMISATIONS WITH OPTIONS                                */
/* GET /products/:productId/customisations                                   */
/* -------------------------------------------------------------------------- */

export const getProductCustomisationsController = async (
  c: Context
) => {
  try {
    const productId = getUuidParam(c, "productId");

    if (!productId) {
      return c.json({ message: "Invalid product ID" }, 400);
    }

    const result = await getProductCustomisations(productId);

    return c.json(
      {
        message: "Product customisations retrieved successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 13. DELETE CUSTOMISATION GROUP                                             */
/* DELETE /customisation-groups/:groupId                                    */
/* -------------------------------------------------------------------------- */

export const deleteCustomisationGroupController = async (
  c: Context
) => {
  try {
    const groupId = getUuidParam(c, "groupId");

    if (!groupId) {
      return c.json({ message: "Invalid group ID" }, 400);
    }

    const result = await deleteCustomisationGroup(groupId);

    return c.json(
      {
        message: "Customisation group deleted successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 14. UPDATE PRODUCT CUSTOMISATION                                          */
/* PATCH /products/:productId/customisations/:groupId                        */
/* -------------------------------------------------------------------------- */

const updateProductCustomisationSchema = z
  .object({
    required: z.boolean().optional(),
    display_order: z.number().int().nonnegative().optional(),
  })
  .refine(
    (data) =>
      data.required !== undefined ||
      data.display_order !== undefined,
    {
      message: "At least one field must be provided",
    }
  );

export const updateProductCustomisationController = async (
  c: Context
) => {
  try {
    const productId = getUuidParam(c, "productId");
    const groupId = getUuidParam(c, "groupId");

    if (!productId || !groupId) {
      return c.json(
        { message: "Invalid product ID or group ID" },
        400
      );
    }

    const body = await c.req.json();

    const validation =
      updateProductCustomisationSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        400
      );
    }

    const result = await updateProductCustomisation(
      productId,
      groupId,
      validation.data
    );

    return c.json(
      {
        message: "Product customisation updated successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};

/* -------------------------------------------------------------------------- */
/* 15. GET PRODUCTS USING A CUSTOMISATION GROUP                              */
/* GET /customisation-groups/:groupId/products                               */
/* -------------------------------------------------------------------------- */

export const getProductsUsingCustomisationGroupController = async (
  c: Context
) => {
  try {
    const groupId = getUuidParam(c, "groupId");

    if (!groupId) {
      return c.json({ message: "Invalid group ID" }, 400);
    }

    const result =
      await getProductsUsingCustomisationGroupService(groupId);

    return c.json(
      {
        message: "Products using customisation group retrieved successfully",
        data: result,
      },
      200
    );
  } catch (error) {
    return handleError(c, error);
  }
};
