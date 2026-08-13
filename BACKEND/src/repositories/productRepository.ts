
import { db } from "../db/db_connection"
import { product } from "../db/schema/product_schema";
import type { CreateProduct } from "../zodSchema/productSchema";


export const productRepository = {
  getAllProducts: async () => {
    // Logic to fetch all products from the database
    return db.select().from(product);
  },

  createProduct: async (productData: CreateProduct) => {
    // Logic to create a new product in the database
    const result = await db.insert(product).values(productData);
    return result;
  }
};

