import type { PaginationParams } from "@/types/common.type";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";

export type TripStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type TripOrderSummary = {
  orderId: string;
  reference: string;
  status?: OrderStatus | string;
  trackingCode?: string;
};

export type TripApiOrderDto = {
  id?: number | string | null;
  reference?: string | null;
  status?: OrderStatus | string | null;
  trackingCode?: string | null;
};

export type TripApiStopDto = {
  id?: number | string | null;
  orderId?: number | string | null;
  order?: TripApiOrderDto | null;
  stopSequence?: number | null;
  stopType?: string | null;
};

export type TripApiDriverDto = {
  avatar?: string | null;
  fullName?: string | null;
  id?: number | string | null;
};

export type TripApiVehicleDto = {
  capacityVolume?: number | null;
  capacityWeight?: number | null;
  emissionRatePerKm?: number | null;
  fuelType?: string | null;
  hubId?: number | string | null;
  id?: number | string | null;
  isActive?: boolean | null;
  licensePlate?: string | null;
  type?: string | null;
};

export type TripApiDto = {
  actualDistance?: number | null;
  currentHubId?: number | null;
  driver?: TripApiDriverDto | null;
  driverId?: number | null;
  driverName?: string | null;
  endTime?: string | null;
  id: number | string;
  orderCount?: number | null;
  ordersOnBoard?: TripApiOrderDto[] | null;
  orders?: Array<{
    id?: number | string | null;
    reference?: string | null;
    status?: OrderStatus | string | null;
    trackingCode?: string | null;
  }> | null;
  startTime?: string | null;
  status?: TripStatus | string | null;
  stops?: TripApiStopDto[] | null;
  totalDistance?: number | null;
  vehicle?: TripApiVehicleDto | null;
  vehicleId?: number | string | null;
  vehicleLicensePlate?: string | null;
};

export type TripVehicleSummary = {
  capacityVolume?: number | null;
  capacityWeight?: number | null;
  emissionRatePerKm?: number | null;
  fuelType?: string | null;
  hubId?: string | null;
  id?: string | null;
  isActive?: boolean | null;
  licensePlate: string;
  type?: string | null;
};

export type TripViewModel = {
  currentHubId?: number | null;
  driverAvatarUrl?: string | null;
  driverId?: number | null;
  driverName: string;
  endTime?: string | null;
  id: string;
  orderCount: number;
  orders: TripOrderSummary[];
  startTime?: string | null;
  status: TripStatus;
  totalDistance?: number | null;
  vehicle?: TripVehicleSummary | null;
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

export type OptimizeTripRouteResult = {
  distance?: number;
  duration?: number;
  message: string;
  waypoints?: Array<{
    lat?: number;
    lng?: number;
    orderId?: number | string;
  }>;
};

export type ManualTripInput = {
  hubId: number | string;
  vehicleId: number | string;
  driverId?: number | string;
  orderIds: (string | number)[];
  note?: string;
};

export type AssignVehicleInput = {
  vehicleId: number | string;
  driverId?: number | string;
};

export type AssignOrdersInput = {
  orderIds: (string | number)[];
};

export type ManualTripResult = {
  success: boolean;
  message?: string;
  trip?: TripApiDto;
  addedOrders?: (string | number)[];
};
