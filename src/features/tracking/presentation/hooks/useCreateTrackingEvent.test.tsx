import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "@/test/render";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { useCreateTrackingEvent } from "./useCreateTrackingEvent";

const { createTrackingEventUseCase } = vi.hoisted(() => ({
  createTrackingEventUseCase: vi.fn(),
}));

vi.mock("@/features/tracking/application/use-cases/tracking.use-cases", () => ({
  createTrackingEventUseCase,
}));

describe("useCreateTrackingEvent", () => {
  beforeEach(() => {
    createTrackingEventUseCase.mockReset();
  });

  it("updates cached tracking status immediately after a successful mutation", async () => {
    createTrackingEventUseCase.mockResolvedValue({
      eventType: "STATUS_CHANGE",
      id: 99,
      status: "DELIVERED",
    });

    const { result, queryClient } = renderHookWithProviders(() =>
      useCreateTrackingEvent(),
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    queryClient.setQueryData(trackingKeys.internalTimeline("42"), {
      currentStatus: "OUT_FOR_DELIVERY",
      dataSource: "api",
      events: [],
      isDemo: false,
      podImageUrl: null,
      podPackageCondition: null,
      recipientName: null,
      trackingCode: "GT-ORD-42",
    });

    await act(async () => {
      await result.current.mutateAsync({
        eventType: "STATUS_CHANGE",
        orderId: 42,
        pod: {
          images: [{ type: "PACKAGE", url: "https://example.com/pod.jpg" }],
          packageCondition: "INTACT",
          receiverName: "Tran Thi B",
        },
        source: "DRIVER_APP",
        status: "DELIVERED",
      });
    });

    expect(
      queryClient.getQueryData(trackingKeys.internalTimeline("42")),
    ).toMatchObject({
      currentStatus: "DELIVERED",
      podImageUrl: "https://example.com/pod.jpg",
      podPackageCondition: "INTACT",
      recipientName: "Tran Thi B",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: trackingKeys.internalTimeline("42"),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["trips"],
    });
  });
});
