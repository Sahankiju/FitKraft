
import {Context} from "hono";
import { categoryServices } from "../services/categoryServices";

import {z } from "zod";

import { createCategorySchema } from "../zodSchema/categorySchema";

export const getAllCategories = async (c: Context) => {
    // Logic to fetch all categories from the database
    const categories = await categoryServices.getAllCategories();
    return c.json(categories);
}

export const createCategory = async (c: Context) => {
    // Logic to create a new category in the database
    const body = await c.req.json();
    const result = createCategorySchema.safeParse(body);
    if (!result.success) {
        return c.json({ 
            message: "validation failed",
            error: z.treeifyError(result.error) }, 400);
    }
    const categoryData = result.data;
    const newCategory = await categoryServices.createCategory(categoryData);
    return c.json(newCategory);
}