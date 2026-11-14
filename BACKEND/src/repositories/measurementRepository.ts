import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db_connection";
import { measurement_profiles } from "../db/schema/measurement_profiles";
import type { MeasurementProfileInput } from "../zodSchema/measurementSchema";

export const measurementRepository = {
  // All profiles of one user, newest first
  findAllByUser: (userId: string) =>
    db
      .select()
      .from(measurement_profiles)
      .where(eq(measurement_profiles.user_id, userId))
      .orderBy(desc(measurement_profiles.createdAt)),

  // One profile, only if it belongs to this user
  findById: async (id: string, userId: string) => {
    const [profile] = await db
      .select()
      .from(measurement_profiles)
      .where(and(eq(measurement_profiles.id, id), eq(measurement_profiles.user_id, userId)));
    return profile;
  },

  create: async (userId: string, input: MeasurementProfileInput) => {
    const [profile] = await db
      .insert(measurement_profiles)
      .values({
        user_id: userId,
        name: input.name,
        notes: input.notes ?? null,
        measurements: input.measurements,
      })
      .returning();
    return profile;
  },

  // Returns undefined if the profile doesn't exist or isn't this user's
  update: async (id: string, userId: string, input: MeasurementProfileInput) => {
    const [profile] = await db
      .update(measurement_profiles)
      .set({
        name: input.name,
        notes: input.notes ?? null,
        measurements: input.measurements,
      })
      .where(and(eq(measurement_profiles.id, id), eq(measurement_profiles.user_id, userId)))
      .returning();
    return profile;
  },

  // Returns undefined if nothing was deleted
  remove: async (id: string, userId: string) => {
    const [deleted] = await db
      .delete(measurement_profiles)
      .where(and(eq(measurement_profiles.id, id), eq(measurement_profiles.user_id, userId)))
      .returning({ id: measurement_profiles.id });
    return deleted;
  },
};