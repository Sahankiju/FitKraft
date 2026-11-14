import { z } from "zod";

// The 11 fixed measurement fields, all in inches.
export const MEASUREMENT_KEYS = [
  "neck",
  "chest",
  "waist",
  "hip",
  "shoulder",
  "sleeve",
  "bicep",
  "wrist",
  "shirt_length",
  "inseam",
  "height",
] as const;

const inches = z.number().positive("Must be greater than 0").max(120, "Too large");

const measurementsShape = Object.fromEntries(
  MEASUREMENT_KEYS.map((key) => [key, inches.optional()])
) as Record<(typeof MEASUREMENT_KEYS)[number], z.ZodOptional<typeof inches>>;

export const measurementProfileSchema = z.object({
  name: z.string().trim().min(1, "Profile name is required").max(256),
  notes: z.string().trim().max(1000).nullish(),
  measurements: z
    .object(measurementsShape)
    .refine((m) => Object.values(m).some((v) => v !== undefined), {
      message: "Enter at least one measurement",
    }),
});

export type MeasurementProfileInput = z.infer<typeof measurementProfileSchema>;