
import { db } from "../db/db_connection"
import { product } from "../db/schema/product_schema";
import type { CreateProduct } from "../zodSchema/productSchema";
import { eq } from "drizzle-orm";


export const productRepository = {
  getProducts: async (options: {
    featured?: boolean;
    limit: number;
}) => {
    if (options.featured === undefined) {
        return db
            .select()
            .from(product)
            .limit(options.limit);
    }

    return db
        .select()
        .from(product)
        .where(eq(product.featured, options.featured))
        .limit(options.limit);
},

  createProduct: async (productData: CreateProduct) => {
    // Logic to create a new product in the database
    const result = await db.insert(product).values(productData);
    return result;
  },
};

