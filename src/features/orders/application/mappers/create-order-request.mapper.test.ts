import { describe, expect, it } from "vitest";
import { mapCreateOrderInputToApiPayload } from "./create-order-request.mapper";

describe("mapCreateOrderInputToApiPayload", () => {
  it("maps the legacy create-order form shape to the backend contract", () => {
    const payload = mapCreateOrderInputToApiPayload({
      contactName: "Lan",
      contactPhone: "0909000001",
      customerName: "Công ty Emerald",
      declaredValueUsd: 150,
      deliveryAddress: "456 Điện Biên Phủ",
      estimatedArrival: "2026-04-21T10:30:00.000Z",
      itemDescription: "Thiết bị điện tử",
      packageDimensions: "40x30x20",
      packageWeightKg: 25,
      pickupAddress: "123 Nguyễn Văn Linh",
      receiverName: "Minh",
      receiverPhone: "0909000002",
      serviceTier: "eco_green",
    });

    expect(payload).toMatchObject({
      receiverAddress: "456 Điện Biên Phủ",
      receiverName: "Minh",
      receiverPhone: "0909000002",
      senderAddress: "123 Nguyễn Văn Linh",
      senderName: "Lan",
      senderPhone: "0909000001",
      serviceType: "ECO_GREEN",
    });
    expect(payload.items).toEqual([
      {
        height: 20,
        length: 40,
        name: "Thiết bị điện tử",
        quantity: 1,
        weight: 25,
        width: 30,
      },
    ]);
    expect(payload.receiverLat).toEqual(expect.any(Number));
    expect(payload.receiverLng).toEqual(expect.any(Number));
    expect(payload.senderLat).toEqual(expect.any(Number));
    expect(payload.senderLng).toEqual(expect.any(Number));
    expect(payload.preferredDeliveryTimeStart).toBe("2026-04-21T08:30:00.000Z");
    expect(payload.preferredDeliveryTimeEnd).toBe("2026-04-21T10:30:00.000Z");
  });

  it("uses stable fallbacks when optional legacy fields are empty", () => {
    const payload = mapCreateOrderInputToApiPayload({
      contactName: "",
      contactPhone: "",
      customerName: "Customer",
      declaredValueUsd: 0,
      deliveryAddress: "Receiver Address",
      estimatedArrival: "",
      itemDescription: "",
      packageDimensions: "",
      packageWeightKg: 1,
      pickupAddress: "Sender Address",
      receiverName: "",
      receiverPhone: "",
      serviceTier: "standard",
    });

    expect(payload.items).toEqual([
      {
        name: "Kiện hàng",
        quantity: 1,
        weight: 1,
      },
    ]);
    expect(payload.senderName).toBe("Customer");
    expect(payload.senderPhone).toBe("0000000000");
    expect(payload.receiverName).toBe("Người nhận");
    expect(payload.receiverPhone).toBe("0000000000");
    expect(payload.preferredDeliveryTimeStart).toBeUndefined();
    expect(payload.preferredDeliveryTimeEnd).toBeUndefined();
  });
});
