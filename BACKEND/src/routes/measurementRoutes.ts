import { Hono } from "hono";

import {
    createMeasurementProfile,
    deleteMeasurementProfile,
    getAllMeasurementProfiles,
    getMeasurementProfile,
    updateMeasurementProfile,
} from "../controllers/measurementController";

const measurementRoutes = new Hono();

measurementRoutes.get("/measurement-profiles", getAllMeasurementProfiles);
measurementRoutes.post("/measurement-profiles", createMeasurementProfile);
measurementRoutes.get("/measurement-profiles/:id", getMeasurementProfile);
measurementRoutes.put("/measurement-profiles/:id", updateMeasurementProfile);
measurementRoutes.delete("/measurement-profiles/:id", deleteMeasurementProfile);

export default measurementRoutes;