import type { TrackingEventCreateInput } from "@/features/tracking/domain/types/tracking.types";

export function validateTrackingEventInput(input: TrackingEventCreateInput) {
  if (input.eventType === "STATUS_CHANGE" && !input.status) {
    throw new Error("Tracking event STATUS_CHANGE yêu cầu `status`.");
  }

  if (input.eventType === "EXCEPTION" && !input.failureReasonCode) {
    throw new Error("Tracking event EXCEPTION yêu cầu `failureReasonCode`.");
  }

  if (input.status === "DELIVERED" && !input.pod) {
    throw new Error("Tracking event DELIVERED yêu cầu dữ liệu POD.");
  }
}
