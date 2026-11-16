import axios from "axios";
import { redirect } from "react-router-dom";

import type { MeasurementProfile } from "../../types/measurement";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/measurement-profiles`;

export async function measurementLoader(): Promise<MeasurementProfile[]> {
    try {
        const response = await axios.get<MeasurementProfile[]>(API_URL, {
            withCredentials: true, // sends the login cookie
        });
        return response.data;
    } catch (err) {
        // Not logged in: send the user to the login page
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            throw redirect("/login");
        }
        throw new Response("Could not load measurement profiles", { status: 500 });
    }
}