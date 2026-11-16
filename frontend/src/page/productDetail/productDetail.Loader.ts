import axios from "axios";
import { type LoaderFunctionArgs } from "react-router-dom";
import type { Product } from "../../types/product";

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
    try {
        const response = await axios.get<Product>(
            `${import.meta.env.VITE_API_URL}/api/v1/products/${params.id}`
        );
        return response.data;
    } catch (err) {
        // Throwing here is what triggers the route's errorElement below.
        throw new Response("Product not found", { status: 404 });
    }
}