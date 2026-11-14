import { measurementRepository } from "../repositories/measurementRepository";
import type { MeasurementProfileInput } from "../zodSchema/measurementSchema";

export const measurementService = {
  listProfiles: (userId: string) => measurementRepository.findAllByUser(userId),

  getProfile: (id: string, userId: string) => measurementRepository.findById(id, userId),

  createProfile: (userId: string, input: MeasurementProfileInput) =>
    measurementRepository.create(userId, input),

  updateProfile: (id: string, userId: string, input: MeasurementProfileInput) =>
    measurementRepository.update(id, userId, input),

  deleteProfile: (id: string, userId: string) => measurementRepository.remove(id, userId),
};