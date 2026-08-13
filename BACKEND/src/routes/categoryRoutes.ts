
import { Hono } from "hono";

import { createCategory, getAllCategories } from "../controllers/categoryController";

const categoryRoutes = new Hono();

categoryRoutes.get("/categories", getAllCategories);
categoryRoutes.post("/categories", createCategory);

export default categoryRoutes;