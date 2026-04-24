const fallbackTrackingLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export const TRACKING_STATUS_LABELS: Record<string, string> = {
  ARRIVED_AT_HUB: "Arrived at transit hub",
  ASSIGNED: "Assigned",
  CANCELLED: "Cancelled",
  DELIVERED: "Delivered",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  PENDING: "Pending",
  PICKED_UP: "Picked up",
};

export const TRACKING_EVENT_LABELS: Record<string, string> = {
  ETA_UPDATE: "ETA update",
  EXCEPTION: "Exception",
  NOTE: "Operations note",
  POD: "Proof of delivery",
  SCAN: "Package scan",
  STATUS_CHANGE: "Status update",
};

export const TRACKING_STEP_STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  current: "Current",
  pending: "Pending",
};

export function getTrackingStatusLabel(value: string) {
  return TRACKING_STATUS_LABELS[value] ?? fallbackTrackingLabel(value);
}

export function getTrackingEventLabel(value: string) {
  return TRACKING_EVENT_LABELS[value] ?? TRACKING_STATUS_LABELS[value] ?? fallbackTrackingLabel(value);
}

export function getTrackingStepStatusLabel(value: string) {
  return TRACKING_STEP_STATUS_LABELS[value] ?? fallbackTrackingLabel(value);
}

export const proofOfDeliveryCopy = {
  fallbackCondition: "Electronic signature required",
  imageAlt: "Proof of delivery",
  pendingCapture: "Pending capture",
  pendingImageAlt: "Proof of delivery pending update",
  pendingRecipient: "Waiting for receiver confirmation",
  recipientLabel: "Receiver",
  title: "Proof of delivery",
  trackingCodeLabel: "Tracking code",
  eyebrow: "POD",
} as const;

export const trackingTimelineCopy = {
  currentStepHint: "Processing for the next delivery leg.",
  eyebrow: "Live tracking",
  title: "Shipment milestones",
} as const;

export const trackingLookupCopy = {
  apiDrivenEyebrow: "System connection",
  apiDrivenDescription:
    "The system is using live data. Please enter the official tracking code from operations.",
  apiDrivenTitle: "Online shipment lookup",
  inputPlaceholder: "Enter tracking code",
  title: "Track your shipment journey",
  trackButton: "Track shipment",
} as const;

export const trackingDetailCopy = {
  cancelConfirm: "Are you sure you want to cancel this order?",
  cancelError: "Unable to cancel the order right now.",
  cancelOrder: "Cancel order",
  cancelSuccess: "Order cancelled successfully.",
  cancelling: "Cancelling...",
  copySuccess: "Tracking link copied.",
  customerActionsDescription:
    "You can continue payment, cancel early-stage orders, or share the tracking link.",
  customerActionsEyebrow: "Customer actions",
  currentStatusHint: "Public order journey",
  errorEyebrow: "Tracking error",
  errorTitle: "Unable to load shipment journey data",
  fallbackError: "The system is temporarily unavailable. Please try again later.",
  helpCenter: "Help center",
  helpText: "Need help? Visit",
  loadingDescription:
    "The system is syncing the latest journey data.",
  loadingEyebrow: "Loading",
  loadingTitle: "Loading latest journey data",
  locationPending: "No location update yet",
  notFoundEyebrow: "Not found",
  notFoundTitle: "No public shipment was found for this tracking code",
  printLabels: "Print labels",
  paymentPendingDescription:
    "This order is waiting for online payment. Complete payment to activate the next processing flow.",
  paymentPendingEyebrow: "Payment",
  paymentPendingTitle: "Order is waiting for payment",
  payNow: "Pay now",
  receiverHint: "Some sensitive information is hidden for security.",
  receiverLabel: "Receiver",
  retry: "Try again",
  searchAnother: "Find another shipment",
  shareSuccess: "Tracking share flow opened.",
  shareText: (trackingCode: string) =>
    `Track order ${trackingCode} at this link.`,
  shareTracking: "Share tracking",
  shareTitle: "Share tracking code",
  shareUnavailable: "Tracking link sharing is unavailable on this device.",
  supportSuffix: "or contact 24/7 support.",
  trackingCodeLabel: "Tracking code",
} as const;

export const internalTrackingCopy = {
  accessErrorEyebrow: "Access error",
  accessErrorTitle: "You do not have permission to view this order's internal timeline",
  connectHint: "Provide an Order ID to view the internal shipment journey.",
  currentStatusLabel: "Current status",
  dataSourceLabel: "Data source",
  dataSourceValue: "Internal API",
  driverEyebrow: "Driver",
  fallbackError: "The system is temporarily unavailable. Unable to retrieve operations data.",
  loadingDescription: "Syncing internal operations data.",
  loadingEyebrow: "Loading",
  loadingTitle: "Loading internal journey data",
  missingOrderDescription:
    "Please access through the management system to view the internal shipment journey.",
  title: "Route execution workspace",
  trackingCodeLabel: "Tracking code",
  trackingErrorEyebrow: "Tracking error",
  trackingErrorTitle: "Unable to load the shipment internal timeline",
  viewLiveTracking: (trackingCode: string) =>
    `Viewing live internal tracking for ${trackingCode}.`,
} as const;
