export const trackingKeys = {
  all: ["tracking"] as const,
  internalTimeline: (orderId: string) =>
    [...trackingKeys.all, "internal", orderId] as const,
  publicDetail: (trackingCode: string) =>
    [...trackingKeys.all, "public", trackingCode] as const,
};
