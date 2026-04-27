import { hasApiBaseUrl } from "@/lib/api/env";
import {
  createTrackingEventRequest,
  getPublicTracking,
  getInternalTracking,
} from "../../infrastructure/api/tracking.api";
import { mapTrackingResponseToViewModel } from "../mappers/tracking-view-model.mapper";
import { ApiError } from "@/lib/api/errors";
import type { TrackingEventCreateInput } from "@/features/tracking/domain/types/tracking.types";
import type { Locale } from "@/i18n/config";
import { validateTrackingEventInput } from "@/features/tracking/application/services/tracking-event-validator";
import {
  uploadMultiplePodImagesRequest,
  uploadPodImageRequest,
} from "@/features/tracking/infrastructure/api/upload.api";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message:
        "Chưa cấu hình kết nối hệ thống. Hãy kiểm tra lại biến môi trường.",
      status: 503,
    });
  }
}

export async function getPublicTrackingUseCase(trackingCode: string, locale?: Locale) {
  assertApiConfigured();
  const response = await getPublicTracking(trackingCode);
  return mapTrackingResponseToViewModel(response, locale);
}

export async function getInternalTrackingUseCase(orderId: string, locale?: Locale) {
  assertApiConfigured();
  const response = await getInternalTracking(orderId);
  return mapTrackingResponseToViewModel(response, locale);
}

export async function createTrackingEventUseCase(input: TrackingEventCreateInput) {
  assertApiConfigured();
  validateTrackingEventInput(input);
  return createTrackingEventRequest(input);
}

export async function uploadPodImageUseCase(file: File) {
  assertApiConfigured();
  return uploadPodImageRequest(file);
}

export async function uploadMultiplePodImagesUseCase(files: ReadonlyArray<File>) {
  assertApiConfigured();
  return uploadMultiplePodImagesRequest(files);
}
