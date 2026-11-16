import axios from "axios";
import type { LoaderFunctionArgs } from "react-router-dom";
import type { Product } from "../../types/product";

export async function productPageLoader({ request }: LoaderFunctionArgs) {
    try {
        const response = await axios.get<Product[]>(
            `${import.meta.env.VITE_API_URL}/api/v1/products`,
            { signal: request.signal }
        );

        return response.data;
    } catch (err) {
        throw new Response("Failed to load products", { status: 500 });
    }
}