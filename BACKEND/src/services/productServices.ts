import { productRepository } from "../repositories/productRepository";
import type { CreateProduct } from "../zodSchema/productSchema";

export const productServices = {
  getAllProducts: async () => {
    // Logic to fetch all products from the database
    const products = await productRepository.getAllProducts();
    return products;
  },
  createProduct: async (productData: CreateProduct) => {
    // Logic to create a new product in the database
    const result = await productRepository.createProduct(productData);
    return result;
  }
}
