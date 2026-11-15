
import { Hono } from "hono";

import {
  createCustomisationGroupController,
  getCustomisationGroupController,
  getReusableCustomisationGroupsController,
  getAllCustomisationGroupsController,
  attachCustomisationGroupController,
  detachCustomisationGroupController,
  createCustomisationOptionController,
  updateCustomisationOptionController,
  deleteCustomisationOptionController,
  updateCustomisationGroupController,
  getProductCustomisationsController,
  deleteCustomisationGroupController,
  updateProductCustomisationController,
  getProductsUsingCustomisationGroupController,
  getCustomisationOptionsController,
} from "../controllers/customisationController";

const customisationRoutes = new Hono();

/* -------------------------------------------------------------------------- */
/* CUSTOMISATION GROUPS                                                       */
/* -------------------------------------------------------------------------- */

// GET all customisation groups
customisationRoutes.get(
  "/customisation-groups",
  getAllCustomisationGroupsController
);

// GET reusable customisation groups
customisationRoutes.get(
  "/customisation-groups/reusable",
  getReusableCustomisationGroupsController
);

// CREATE customisation group
customisationRoutes.post(
  "/customisation-groups",
  createCustomisationGroupController
);

// GET customisation group by ID
customisationRoutes.get(
  "/customisation-groups/:groupId",
  getCustomisationGroupController
);

// UPDATE customisation group
customisationRoutes.patch(
  "/customisation-groups/:groupId",
  updateCustomisationGroupController
);

// DELETE customisation group
customisationRoutes.delete(
  "/customisation-groups/:groupId",
  deleteCustomisationGroupController
);

// GET products using a customisation group
customisationRoutes.get(
  "/customisation-groups/:groupId/products",
  getProductsUsingCustomisationGroupController
);

/* -------------------------------------------------------------------------- */
/* CUSTOMISATION OPTIONS                                                      */
/* -------------------------------------------------------------------------- */

// GET all options for a customisation group
customisationRoutes.get(
  "/customisation-groups/:groupId/options",
  getCustomisationOptionsController
);

// CREATE option inside a group
customisationRoutes.post(
  "/customisation-groups/:groupId/options",
  createCustomisationOptionController
);

// UPDATE customisation option
customisationRoutes.patch(
  "/customisation-options/:optionId",
  updateCustomisationOptionController
);

// DELETE customisation option
customisationRoutes.delete(
  "/customisation-options/:optionId",
  deleteCustomisationOptionController
);

/* -------------------------------------------------------------------------- */
/* PRODUCT CUSTOMISATIONS                                                     */
/* -------------------------------------------------------------------------- */

// GET product customisations with options
customisationRoutes.get(
  "/products/:productId/customisations",
  getProductCustomisationsController
);

// ATTACH customisation group to product
customisationRoutes.post(
  "/products/:productId/customisations",
  attachCustomisationGroupController
);

// UPDATE product customisation (required, display_order)
customisationRoutes.patch(
  "/products/:productId/customisations/:groupId",
  updateProductCustomisationController
);

// DETACH customisation group from product
customisationRoutes.delete(
  "/products/:productId/customisations/:groupId",
  detachCustomisationGroupController
);

export default customisationRoutes;
