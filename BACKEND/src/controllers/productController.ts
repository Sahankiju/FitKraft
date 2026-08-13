
import {Context} from "hono";
import { productServices } from "../services/productServices";

export const getAllProducts = async (c: Context) => {
    // Logic to fetch all products from the database
    const products = await productServices.getAllProducts();
    return c.json(products);
}

export const createProduct = async (c: Context) => {
    // Logic to create a new product in the database
    const productData = await c.req.json();
    const result = await productServices.createProduct(productData);
    return c.json(result);
}