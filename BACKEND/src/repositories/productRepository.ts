import { create } from "node:domain";
import { db } from "../db/db_connection"
import { product } from "../db/schema/product_schema";


export const productRepository = {
  getAllProducts: async () => {
    // Logic to fetch all products from the database
    return db.select().from(product);
  },

  createProduct: async (productData: any) => {
    // Logic to create a new product in the database
    const result = await db.insert(product).values(productData);
    return result;
  }
};

