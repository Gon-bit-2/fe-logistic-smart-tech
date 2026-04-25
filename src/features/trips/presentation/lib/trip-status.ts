import type { TripStatus } from "@/features/trips/domain/types/trip.types";

export function isActiveTripStatus(status: TripStatus) {
  return status === "PENDING" || status === "IN_PROGRESS";
}

export function getTripStatusLabel(status: TripStatus) {
  switch (status) {
    case "PENDING":
      return "Chờ khởi hành";
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã hủy";
  }
}

export function getTripStatusTone(status: TripStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return "blue" as const;
    case "COMPLETED":
      return "green" as const;
    case "CANCELLED":
      return "red" as const;
    case "PENDING":
    default:
      return "amber" as const;
  }
}
