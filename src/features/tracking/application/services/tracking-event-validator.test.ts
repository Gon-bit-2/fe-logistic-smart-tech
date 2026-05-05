import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { validateTrackingEventInput } from "./tracking-event-validator";

describe("validateTrackingEventInput", () => {
  it("rejects invalid tracking event source", () => {
    expect(() =>
      validateTrackingEventInput({
        eventType: "STATUS_CHANGE",
        orderId: 1,
        source: "WEB_APP" as never,
        status: "PICKED_UP",
      }),
    ).toThrow("Nguồn cập nhật hành trình không hợp lệ");
  });

  it("rejects delivered events without receiver name", () => {
    expect(() =>
      validateTrackingEventInput({
        eventType: "STATUS_CHANGE",
        orderId: 1,
        pod: {
          images: [{ type: "PACKAGE", url: "https://example.com/pod.jpg" }],
          packageCondition: "INTACT",
          receiverName: "   ",
        },
        source: "DRIVER_APP",
        status: "DELIVERED",
      }),
    ).toThrow(ApiError);
  });

  it("rejects delivered events without pod images", () => {
    expect(() =>
      validateTrackingEventInput({
        eventType: "STATUS_CHANGE",
        orderId: 1,
        pod: {
          images: [],
          packageCondition: "INTACT",
          receiverName: "Tran Thi B",
        },
        source: "DRIVER_APP",
        status: "DELIVERED",
      }),
    ).toThrow("ít nhất 1 ảnh biên nhận");
  });

  it("rejects delivered events with invalid package condition", () => {
    expect(() =>
      validateTrackingEventInput({
        eventType: "STATUS_CHANGE",
        orderId: 1,
        pod: {
          images: [{ type: "PACKAGE", url: "https://example.com/pod.jpg" }],
          packageCondition: "BROKEN" as never,
          receiverName: "Tran Thi B",
        },
        source: "DRIVER_APP",
        status: "DELIVERED",
      }),
    ).toThrow("Tình trạng kiện hàng không hợp lệ");
  });
});
