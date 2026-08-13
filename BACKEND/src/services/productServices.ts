import { productRepository } from "../repositories/productRepository";

export const productServices = {
  getAllProducts: async () => {
    // Logic to fetch all products from the database
    const products = await productRepository.getAllProducts();
    return products;
  },
  createProduct: async (productData: any) => {
    // Logic to create a new product in the database
    const result = await productRepository.createProduct(productData);
    return result;
  }
}
