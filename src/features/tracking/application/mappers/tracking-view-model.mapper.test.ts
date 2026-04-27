import { describe, expect, it, vi } from "vitest";
import { mapTrackingResponseToViewModel } from "./tracking-view-model.mapper";

describe("tracking-view-model.mapper", () => {
  it("maps events and proof-of-delivery fields into the view model", () => {
    const viewModel = mapTrackingResponseToViewModel({
      trackingCode: "ELG-2026-0001",
      currentStatus: "DELIVERED",
      events: [
        {
          id: "evt-1",
          eventType: "STATUS_CHANGE",
          status: "OUT_FOR_DELIVERY",
          location: "Quận 1",
          createdAt: "2026-04-19T08:00:00.000Z",
        },
        {
          id: "evt-2",
          eventType: "POD",
          status: "DELIVERED",
          location: "Quận 3",
          description: "Đã giao thành công",
          createdAt: "2026-04-19T10:00:00.000Z",
          pod: {
            receiverName: "Lan",
            packageCondition: "INTACT",
            images: [{ url: "https://example.com/pod.jpg", type: "PACKAGE" }],
          },
        },
      ],
    });

    expect(viewModel.currentStatus).toBe("DELIVERED");
    expect(viewModel.podImageUrl).toBe("https://example.com/pod.jpg");
    expect(viewModel.recipientName).toBe("Lan");
    expect(viewModel.events[1]).toMatchObject({
      id: "evt-2",
      status: "current",
      location: "Quận 3",
      description: "Đã giao thành công",
    });
  });

  it("creates a fallback current event when the API returns no events", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-19T10:00:00.000Z"));

    const viewModel = mapTrackingResponseToViewModel({
      trackingCode: "ELG-EMPTY",
      currentStatus: "PENDING",
      events: [],
    });

    expect(viewModel.events).toEqual([
      {
        id: "PENDING-current",
        label: "Chờ xác nhận",
        location: "Chưa có cập nhật vị trí",
        status: "current",
        timestamp: "2026-04-19T10:00:00.000Z",
      },
    ]);

    vi.useRealTimers();
  });

  it("uses coordinates and occurredAt when location text is missing", () => {
    const viewModel = mapTrackingResponseToViewModel({
      trackingCode: "ELG-GPS-1",
      currentStatus: "IN_TRANSIT",
      events: [
        {
          id: "evt-gps",
          eventType: "STATUS_CHANGE",
          status: "IN_TRANSIT",
          latitude: 10.776889,
          longitude: 106.700806,
          occurredAt: "2026-04-19T09:15:00.000Z",
        },
      ],
    });

    expect(viewModel.events[0]).toMatchObject({
      location: "10.77689, 106.70081",
      timestamp: "2026-04-19T09:15:00.000Z",
    });
  });
});
