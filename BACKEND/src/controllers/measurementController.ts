import type { Context } from "hono";
import { z } from "zod";
import { auth } from "../utils/auth";
import { measurementService } from "../services/measurementService";
import { measurementProfileSchema } from "../zodSchema/measurementSchema";

// The logged-in user always comes from the session, never from the request body.
async function getUserId(c: Context): Promise<string | null> {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  return session?.user.id ?? null;
}

const isUuid = (value: string | undefined): value is string =>
  z.string().uuid().safeParse(value).success;

export const getAllMeasurementProfiles = async (c: Context) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ message: "Authentication required" }, 401);

  return c.json(await measurementService.listProfiles(userId));
};

export const getMeasurementProfile = async (c: Context) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ message: "Authentication required" }, 401);

  const id = c.req.param("id");
  if (!isUuid(id)) return c.json({ message: "Invalid profile id" }, 400);

  const profile = await measurementService.getProfile(id, userId);
  if (!profile) return c.json({ message: "Profile not found" }, 404);

  return c.json(profile);
};

export const createMeasurementProfile = async (c: Context) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ message: "Authentication required" }, 401);

  const parsed = measurementProfileSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json({ message: "Validation failed", errors: parsed.error.flatten() }, 400);
  }

  const profile = await measurementService.createProfile(userId, parsed.data);
  return c.json(profile, 201);
};

export const updateMeasurementProfile = async (c: Context) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ message: "Authentication required" }, 401);

  const id = c.req.param("id");
  if (!isUuid(id)) return c.json({ message: "Invalid profile id" }, 400);

  const parsed = measurementProfileSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json({ message: "Validation failed", errors: parsed.error.flatten() }, 400);
  }

  const profile = await measurementService.updateProfile(id, userId, parsed.data);
  if (!profile) return c.json({ message: "Profile not found" }, 404);

  return c.json(profile);
};

export const deleteMeasurementProfile = async (c: Context) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ message: "Authentication required" }, 401);

  const id = c.req.param("id");
  if (!isUuid(id)) return c.json({ message: "Invalid profile id" }, 400);

  const deleted = await measurementService.deleteProfile(id, userId);
  if (!deleted) return c.json({ message: "Profile not found" }, 404);

  return c.json({ message: "Profile deleted" });
};