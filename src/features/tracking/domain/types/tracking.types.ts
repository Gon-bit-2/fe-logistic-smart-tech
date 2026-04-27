import type { OrderStatus } from "@/features/orders/domain/types/order.types";

export type TrackingEventType =
  | "STATUS_CHANGE"
  | "SCAN"
  | "NOTE"
  | "POD"
  | "EXCEPTION"
  | "ETA_UPDATE";

export type TrackingEventSource =
  | "DRIVER_APP"
  | "HUB_SCANNER"
  | "SYSTEM"
  | "ADMIN_PORTAL"
  | "CUSTOMER_APP";

export type TrackingPackageCondition = "INTACT" | "DAMAGED" | "PARTIAL";

export type TrackingProofImageType =
  | "PACKAGE"
  | "SIGNATURE"
  | "DELIVERY_LOCATION"
  | "DAMAGE_EVIDENCE"
  | "FAILED_ATTEMPT";

export type TrackingPodImage = {
  type?: TrackingProofImageType;
  url: string;
};

export type TrackingPod = {
  images?: TrackingPodImage[];
  deliveryNote?: string;
  packageCondition?: TrackingPackageCondition;
  receiverName?: string;
  receiverRelation?: string;
};

export type TrackingEventCreateInput = {
  attemptNumber?: number;
  description?: string;
  eventType: TrackingEventType;
  failureReasonCode?: string;
  latitude?: number;
  location?: string;
  longitude?: number;
  occurredAt?: Date | string;
  orderId: number;
  pod?: TrackingPod;
  source: TrackingEventSource;
  status?: OrderStatus;
};

export type TrackingLocationEvent = {
  driverId: number | string;
  lat: number;
  lng: number;
  timestamp: string;
  tripId: number;
};

export type TrackingEventApi = {
  occurredAt?: string;
  createdAt?: string;
  description?: string;
  eta?: string;
  eventType?: TrackingEventType | string;
  failureReasonCode?: string;
  id?: number | string;
  latitude?: number | null;
  location?: string;
  longitude?: number | null;
  pod?: TrackingPod;
  source?: TrackingEventSource;
  status?: OrderStatus | string;
};

export type TrackingTimelineResponse = {
  currentStatus: OrderStatus | string;
  events: TrackingEventApi[];
  trackingCode: string;
};

export type TrackingTimelineItem = {
  description?: string;
  id: string;
  label: string;
  location: string;
  status: "completed" | "current" | "pending";
  timestamp: string;
};

export type TrackingDetailViewModel = {
  currentStatus: OrderStatus | string;
  dataSource: "api";
  events: TrackingTimelineItem[];
  isDemo: false;
  podImageUrl: string | null;
  podPackageCondition: string | null;
  recipientName: string | null;
  trackingCode: string;
};
