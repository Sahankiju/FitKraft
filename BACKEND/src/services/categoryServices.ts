
import { categoryRepository } from "../repositories/categoryRepository";

import type { CreateCategory } from "../zodSchema/categorySchema";

export const categoryServices = {
  getAllCategories: async () => {
    // Logic to fetch all categories from the database
    const categories = await categoryRepository.getAllCategories();
    return categories;
  },
  createCategory: async (categoryData: CreateCategory) => {
    // Logic to create a new category in the database
    const result = await categoryRepository.createCategory(categoryData);
    return result;
  }
}
