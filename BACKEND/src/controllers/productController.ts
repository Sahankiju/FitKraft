
import {Context} from "hono";
import { productServices } from "../services/productServices";
import { createProductSchema } from "../zodSchema/productSchema";
import {z } from "zod";

export const getAllProducts = async (c: Context) => {
    // Logic to fetch all products from the database
    const products = await productServices.getAllProducts();
    return c.json(products);
}

export const createProduct = async (c: Context) => {
    // Logic to create a new product in the database
    const body = await c.req.json();
    console.log("BODY:", body);
    const result = createProductSchema.safeParse(body);
    if (!result.success) {
        return c.json({ 
            message: "validation failed",
            error: z.treeifyError(result.error) }, 400);
    }
    const productData = result.data;
    const newProduct = await productServices.createProduct(productData);
    return c.json(newProduct);
}