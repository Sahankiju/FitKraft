
import {Context} from "hono";
//import { validateProductImages } from "../utils/validateProductImages";
import { productServices } from "../services/productServices";
import { createProductSchema } from "../zodSchema/productSchema";
import {z } from "zod";

export const getProducts = async (c: Context) => {
    // Logic to fetch all products from the database
    const featured = c.req.query("featured");
    const limit = Number(c.req.query("limit")) || 10;
    const products = await productServices.getProducts({ featured:featured==="true"?true:undefined, limit });
    return c.json(products);
}

export const createProduct = async (c: Context) => {
    const body = await c.req.parseBody({ all: true });

    // Extract images
    const files = body.images;

    const images = Array.isArray(files)
        ? files.filter((file): file is File => file instanceof File)
        : files instanceof File
            ? [files]
            : [];

    // Remove images from product data
    const {
        images: _ignored,
        ...productData
    } = body;

    // Validate product data
    const result = createProductSchema.safeParse(productData);

    if (!result.success) {
        return c.json({
            message: "validation failed",
            error: z.treeifyError(result.error)
        }, 400);
    }

    const newProduct = await productServices.createProduct(
        result.data,
        images
    );

    return c.json(newProduct, 201);
};