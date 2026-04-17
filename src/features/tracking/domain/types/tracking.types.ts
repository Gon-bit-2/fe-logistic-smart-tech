import type { OrderStatus } from "@/features/orders/domain/types/order.types";

export type TrackingEventType =
  | "STATUS_CHANGE"
  | "SCAN"
  | "NOTE"
  | "POD"
  | "EXCEPTION"
  | "ETA_UPDATE";

export type TrackingPodImage = {
  type?: string;
  url: string;
};

export type TrackingPod = {
  images?: TrackingPodImage[];
  packageCondition?: string;
  receiverName?: string;
};

export type TrackingEventApi = {
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
  source?: string;
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

