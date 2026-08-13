
import { Hono } from "hono";
import { createProduct, getAllProducts } from "../controllers/productController";

const productRoutes = new Hono();

productRoutes.get("/products", getAllProducts);
productRoutes.post("/products", createProduct);

export default productRoutes;