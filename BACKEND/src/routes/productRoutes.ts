
import { Hono } from "hono";
import { createProduct, getProducts } from "../controllers/productController";

const productRoutes = new Hono();

productRoutes.get("/products", getProducts);
productRoutes.post("/products", createProduct);
productRoutes.get("/products")


export default productRoutes;