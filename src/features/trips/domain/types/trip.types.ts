import type { PaginationParams } from "@/types/common.type";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";
import type { TrackingPod } from "@/features/tracking/domain/types/tracking.types";
import type { PaymentApiDto, PaymentRecordDto } from "@/features/payments/domain/types/payment.types";

export type TripStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type AssignmentRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type TripOrderSummary = {
  orderId: string;
  reference: string;
  status?: OrderStatus | string;
  trackingCode?: string;
};

export type TripApiOrderDto = {
  currentHubId?: number | null;
  currentTripId?: number | string | null;
  id?: number | string | null;
  payment?: PaymentApiDto | null;
  paymentMethod?: string | null;
  preferredDeliveryTimeEnd?: string | null;
  preferredDeliveryTimeStart?: string | null;
  receiverAddress?: string | null;
  receiverLat?: number | null;
  receiverLng?: number | null;
  receiverName?: string | null;
  receiverPhone?: string | null;
  reference?: string | null;
  senderAddress?: string | null;
  senderLat?: number | null;
  senderLng?: number | null;
  status?: OrderStatus | string | null;
  totalVolume?: number | null;
  totalWeight?: number | null;
  trackingCode?: string | null;
};

export type TripApiStopDto = {
  actualArrivalTime?: string | null;
  expectedArrivalTime?: string | null;
  hub?: {
    id?: number | string | null;
    latitude?: number | null;
    longitude?: number | null;
    name?: string | null;
  } | null;
  hubId?: number | string | null;
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

export type TripStopOrderDetail = {
  currentHubId?: number | null;
  currentTripId?: string | null;
  id: string;
  payment?: PaymentRecordDto | null;
  preferredDeliveryTimeEnd?: string | null;
  preferredDeliveryTimeStart?: string | null;
  receiverAddress?: string | null;
  receiverLat?: number | null;
  receiverLng?: number | null;
  receiverName?: string | null;
  receiverPhone?: string | null;
  reference: string;
  senderAddress?: string | null;
  senderLat?: number | null;
  senderLng?: number | null;
  status?: OrderStatus | string;
  totalVolume?: number | null;
  totalWeight?: number | null;
  trackingCode?: string | null;
};

export type TripStopDetail = {
  actualArrivalTime?: string | null;
  expectedArrivalTime?: string | null;
  hub?: {
    id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    name?: string | null;
  } | null;
  hubId?: string | null;
  id?: string | null;
  order?: TripStopOrderDetail | null;
  orderId?: string | null;
  stopSequence: number;
  stopType?: string | null;
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
  stops: TripStopDetail[];
  totalDistance?: number | null;
  vehicle?: TripVehicleSummary | null;
  vehicleId?: string | null;
  vehicleLicensePlate: string;
};

export type TripListParams = PaginationParams & {
  hubId?: number;
  search?: string;
  status?: TripStatus;
};

export type UpdateTripStatusInput = {
  podByOrderId?: Record<string, TrackingPod>;
  status: TripStatus;
};

export type AutoDispatchInput = {
  hubId?: number;
};

export type AutoDispatchResult = {
  jobId?: string;
  message: string;
};

export type DispatchStopInput = {
  actualArrivalTime?: Date | string | null;
  expectedArrivalTime?: Date | string | null;
  hubId?: number | null;
  orderId?: number | null;
  stopSequence: number;
  stopType: "PICKUP" | "DROPOFF" | "HUB_TRANSFER";
};

export type DispatchSuggestion = {
  driverId: number;
  driverName?: string;
  hubId: number;
  orderIds: number[];
  orders?: Array<{
    id: number;
    totalVolume: number;
    totalWeight: number;
    trackingCode?: string | null;
  }>;
  stops: DispatchStopInput[];
  totalVolume: number;
  totalWeight: number;
  vehicleId: number;
  vehicleLicensePlate?: string;
};

export type DispatchPreviewResult = {
  availableDriverIds: number[];
  hubId: number;
  suggestions: DispatchSuggestion[];
  unassignedOrderIds: number[];
};

export type DispatchPreviewInput = {
  hubId?: number;
};

export type DispatchBoardInput = {
  hubId?: number;
};

export type DispatchBoardOrder = {
  id: number;
  receiverAddress?: string | null;
  receiverName?: string | null;
  senderAddress?: string | null;
  status: OrderStatus | string;
  totalVolume: number;
  totalWeight: number;
  trackingCode?: string | null;
};

export type DispatchBoardDriver = {
  activeTripId?: number | null;
  activeTripStatus?: TripStatus | null;
  fullName: string;
  id: number;
  isAvailable: boolean;
  phone?: string | null;
};

export type DispatchBoardVehicle = {
  activeTripId?: number | null;
  activeTripStatus?: TripStatus | null;
  capacityVolume: number;
  capacityWeight: number;
  id: number;
  isAvailable: boolean;
  licensePlate: string;
  type: string;
};

export type DispatchBoardPendingTrip = {
  driverId: number;
  driverName: string;
  id: number;
  orderCount: number;
  orderIds: number[];
  orders: DispatchBoardOrder[];
  remainingVolume: number;
  remainingWeight: number;
  status: TripStatus;
  totalAssignedVolume: number;
  totalAssignedWeight: number;
  vehicleId: number;
  vehicleLicensePlate: string;
};

export type DispatchBoardResult = {
  dispatchableOrders: DispatchBoardOrder[];
  drivers: DispatchBoardDriver[];
  hubId: number;
  pendingTrips: DispatchBoardPendingTrip[];
  summary: {
    availableDriverCount: number;
    availableVehicleCount: number;
    dispatchableOrderCount: number;
    dispatchableVolume: number;
    dispatchableWeight: number;
    pendingTripCount: number;
  };
  vehicles: DispatchBoardVehicle[];
};

export type DriverTripSummary = {
  id: number;
  status: TripStatus;
  vehicleId: number;
  vehicleLicensePlate: string;
};

export type DriverAssignmentRequest = {
  createdAt: string;
  driverId: number;
  driverName: string;
  hubId: number;
  id: number;
  orderId: number;
  orderTrackingCode: string;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  reviewedById?: number | null;
  status: AssignmentRequestStatus;
  trip?: DriverTripSummary | null;
};

export type DriverAssignableOrder = {
  id: number;
  preferredDeliveryTimeEnd?: string | null;
  preferredDeliveryTimeStart?: string | null;
  receiverAddress?: string | null;
  receiverLat?: number | null;
  receiverLng?: number | null;
  receiverName?: string | null;
  receiverPhone?: string | null;
  request?: DriverAssignmentRequest | null;
  senderAddress?: string | null;
  senderLat?: number | null;
  senderLng?: number | null;
  status: OrderStatus | string;
  totalVolume: number;
  totalWeight: number;
  trackingCode?: string | null;
};

export type DriverDispatchBoardResult = {
  activeTrip?: DriverTripSummary | null;
  assignableOrders: DriverAssignableOrder[];
  hubId: number;
  requests: DriverAssignmentRequest[];
  summary: {
    activeTripCount: number;
    assignableOrderCount: number;
    completedTripCount: number;
    inProgressTripCount: number;
    pendingRequestCount: number;
  };
};

export type CreateDriverAssignmentRequestInput = {
  orderId: number;
};

export type AssignmentRequestApproveInput = {
  tripId?: number;
  vehicleId?: number;
};

export type AssignmentRequestRejectInput = {
  reviewNote: string;
};

export type AssignmentRequestInboxItem = DriverAssignmentRequest & {
  order: DispatchBoardOrder;
  pendingTripsForDriver: DriverTripSummary[];
};

export type AssignmentRequestInboxResult = {
  data: AssignmentRequestInboxItem[];
  totalItems: number;
};

export type DispatchApproveInput = {
  driverId: number;
  hubId: number;
  orderIds: number[];
  stops?: DispatchStopInput[];
  vehicleId: number;
};

export type OptimizeTripRouteResult = {
  fallbackUsed: boolean;
  provider: "OSRM" | "HAVERSINE";
  stops: Array<{
    actualArrivalTime?: string | null;
    expectedArrivalTime?: string | null;
    hubId?: number | null;
    id: number;
    orderId?: number | null;
    stopSequence: number;
    stopType: DispatchStopInput["stopType"];
  }>;
  totalDistance: number;
  totalDuration: number;
  tripId: number;
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

export type TripMutationResponse = TripApiDto | ManualTripResult;
