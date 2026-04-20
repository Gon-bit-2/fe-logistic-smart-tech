import type { PaginationParams } from "@/types/common.type";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";

export type TripStatus =
  | "PLANNED"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "ASSIGNED";

export type TripOrderSummary = {
  orderId: string;
  reference: string;
  status?: OrderStatus | string;
  trackingCode?: string;
};

export type TripApiDto = {
  actualDistance?: number | null;
  currentHubId?: number | null;
  driverId?: number | null;
  driverName?: string | null;
  id: number | string;
  orderCount?: number | null;
  orders?: Array<{
    id?: number | string | null;
    reference?: string | null;
    status?: OrderStatus | string | null;
    trackingCode?: string | null;
  }> | null;
  status?: TripStatus | string | null;
  vehicleId?: number | string | null;
  vehicleLicensePlate?: string | null;
};

export type TripViewModel = {
  currentHubId?: number | null;
  driverId?: number | null;
  driverName: string;
  id: string;
  orderCount: number;
  orders: TripOrderSummary[];
  status: TripStatus;
  vehicleId?: string | null;
  vehicleLicensePlate: string;
};

export type TripListParams = PaginationParams & {
  search?: string;
  status?: TripStatus;
};

export type UpdateTripStatusInput = {
  status: TripStatus;
};

export type AutoDispatchInput = {
  hubId?: number;
};

export type AutoDispatchResult = {
  jobId?: string;
  message: string;
};
