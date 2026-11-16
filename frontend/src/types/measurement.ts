// A saved measurement profile, exactly as the backend returns it
export interface MeasurementProfile {
    id: string;
    user_id: string;
    name: string;
    measurements: Record<string, number>; // e.g. { neck: 15, chest: 42 }, all in inches
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

// What the frontend sends when creating or updating a profile
export interface MeasurementProfileInput {
    name: string;
    notes: string;
    measurements: Record<string, number>;
}

export const CURRENT_PROFILE_KEY = "currentMeasurementProfileId";