import { db } from "../db/db_connection";
import { product } from "../db/schema/product_schema";
import { product_images } from "../db/schema/product_images";
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
        const [result] = await db
            .insert(product)
            .values(productData)
            .returning();

        return result;
    },

    createProductImages: async (
        productId: string,
        images: {
            image_url: string;
            public_id: string;
            display_order: number;
        }[]
    ) => {
        return db
            .insert(product_images)
            .values(
                images.map((image) => ({
                    product_id: productId,
                    image_url: image.image_url,
                    public_id: image.public_id,
                    display_order: image.display_order,
                }))
            )
            .returning();
    },

    deleteProduct: async (productId: string) => {
        return db
            .delete(product)
            .where(eq(product.id, productId));
    },
};