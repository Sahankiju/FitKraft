
import { db } from "../db/db_connection"
import { category } from "../db/schema/category_schema";
import type { CreateCategory } from "../zodSchema/categorySchema";



export const categoryRepository = {
  getAllCategories: async () => {
    // Logic to fetch all categories from the database
    return db.select().from(category);
  },

  createCategory: async (categoryData: CreateCategory) => {
    // Logic to create a new category in the database
    const result = await db.insert(category).values(categoryData);
    return result;
  }
};

