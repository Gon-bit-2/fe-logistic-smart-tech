import { hasApiBaseUrl } from "@/lib/api/env";
import {
  getPublicTracking,
  getInternalTracking,
} from "../../infrastructure/api/tracking.api";
import { mapTrackingResponseToViewModel } from "../mappers/tracking-view-model.mapper";
import { ApiError } from "@/lib/api/errors";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message:
        "API is not configured. Please check your environment variables.",
      status: 503,
    });
  }
}

export async function getPublicTrackingUseCase(trackingCode: string) {
  assertApiConfigured();
  const response = await getPublicTracking(trackingCode);
  return mapTrackingResponseToViewModel(response);
}

export async function getInternalTrackingUseCase(orderId: string) {
  assertApiConfigured();
  const response = await getInternalTracking(orderId);
  return mapTrackingResponseToViewModel(response);
}
