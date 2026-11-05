import { productRepository } from "../repositories/productRepository";
import type { CreateProduct } from "../zodSchema/productSchema";
import cloudinary from "../config/cloudinary";

export const productServices = {
    getProducts: async (options: { featured?: boolean; limit: number }) => {
        const products = await productRepository.getProducts(options);
        return products;
    },

    createProduct: async (productData: CreateProduct, images: File[]) => {
        // Create product first to get its ID
        const newProduct = await productRepository.createProduct(productData);
        if (!newProduct) {
        throw new Error("Failed to create product");
        }

        const uploadedImages: {
            image_url: string;
            public_id: string;
            display_order: number;
        }[] = [];

        try {
            // Upload images to Cloudinary
            for (const [index, file] of images.entries()) {
                if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                    throw new Error("INVALID_IMAGE_TYPE");
                }

                if (file.size === 0 || file.size > 5 * 1024 * 1024) {
                    throw new Error("INVALID_IMAGE_SIZE");
                }

                const buffer = Buffer.from(await file.arrayBuffer());

                const result = await new Promise<{
                    secure_url: string;
                    public_id: string;
                }>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: `fitkraft/products/${newProduct.id}`,
                            resource_type: "image",
                        },
                        (error, uploaded) => {
                            if (error) return reject(error);

                            if (!uploaded) {
                                return reject(new Error("UPLOAD_FAILED"));
                            }

                            resolve({
                                secure_url: uploaded.secure_url,
                                public_id: uploaded.public_id,
                            });
                        }
                    );

                    stream.end(buffer);
                });

                uploadedImages.push({
                    image_url: result.secure_url,
                    public_id: result.public_id,
                    display_order: index,
                });
            }

            // Save image metadata in database
            if (uploadedImages.length > 0) {
                await productRepository.createProductImages(
                    newProduct.id,
                    uploadedImages
                );
            }

            return {
                ...newProduct,
                images: uploadedImages,
            };

        } catch (error) {
            // Clean up uploaded Cloudinary images
            await Promise.allSettled(
                uploadedImages.map((image) =>
                    cloudinary.uploader.destroy(image.public_id)
                )
            );

            // Remove the product if image upload or saving fails
            await productRepository.deleteProduct(newProduct.id);

            throw error;
        }
    },
};