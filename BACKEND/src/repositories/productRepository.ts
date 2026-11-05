
import { db } from "../db/db_connection"
import { product } from "../db/schema/product_schema";
import type { CreateProduct } from "../zodSchema/productSchema";
import { eq } from "drizzle-orm";


export const productRepository = {
  getAllProducts: async (options: {
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
  const [newProduct] = await db
    .insert(product)
    .values(productData)
    .returning();

  return newProduct;
},
};

