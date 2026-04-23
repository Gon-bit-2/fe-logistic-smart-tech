import { describe, expect, it } from "vitest";
import {
  mapCreateOrderInputToApiPayload,
  mapCreateOrderInputToQuotePayload,
} from "./create-order-request.mapper";

function createResolvedAddress(address: string, placeId: string, latitude: number, longitude: number) {
  return {
    address,
    isResolved: true,
    latitude,
    longitude,
    placeId,
    query: address,
  };
}

describe("create-order request mappers", () => {
  it("maps the resolved order draft to the backend order contract", () => {
    const payload = mapCreateOrderInputToApiPayload({
      contactName: "Lan",
      contactPhone: "0909000001",
      customerName: "Công ty Emerald",
      declaredValueUsd: 150,
      delivery: createResolvedAddress("456 Điện Biên Phủ", "delivery-place", 10.773118, 106.698299),
      estimatedArrival: "2026-04-21T10:30:00.000Z",
      itemDescription: "Thiết bị điện tử",
      packageDimensions: "40x30x20",
      packageWeightKg: 25,
      paymentMethod: "COD",
      pickup: createResolvedAddress("123 Nguyễn Văn Linh", "pickup-place", 10.776889, 106.700806),
      receiverName: "Minh",
      receiverPhone: "0909000002",
      serviceTier: "eco_green",
    });

    expect(payload).toMatchObject({
      receiverAddress: "456 Điện Biên Phủ",
      receiverLat: 10.773118,
      receiverLng: 106.698299,
      receiverName: "Minh",
      receiverPhone: "0909000002",
      paymentMethod: "COD",
      senderAddress: "123 Nguyễn Văn Linh",
      senderLat: 10.776889,
      senderLng: 106.700806,
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
    expect(payload.preferredDeliveryTimeStart).toBe("2026-04-21T08:30:00.000Z");
    expect(payload.preferredDeliveryTimeEnd).toBe("2026-04-21T10:30:00.000Z");
  });

  it("maps the same resolved draft to the quote contract without fake coordinates", () => {
    const payload = mapCreateOrderInputToQuotePayload({
      contactName: "Lan",
      contactPhone: "0909000001",
      customerName: "Công ty Emerald",
      declaredValueUsd: 150,
      delivery: createResolvedAddress("456 Điện Biên Phủ", "delivery-place", 10.773118, 106.698299),
      estimatedArrival: "",
      itemDescription: "Thiết bị điện tử",
      packageDimensions: "40x30x20",
      packageWeightKg: 25,
      paymentMethod: "STRIPE",
      pickup: createResolvedAddress("123 Nguyễn Văn Linh", "pickup-place", 10.776889, 106.700806),
      receiverName: "Minh",
      receiverPhone: "0909000002",
      serviceTier: "standard",
    });

    expect(payload).toEqual({
      items: [
        {
          height: 20,
          length: 40,
          name: "Thiết bị điện tử",
          quantity: 1,
          weight: 25,
          width: 30,
        },
      ],
      receiverLat: 10.773118,
      receiverLng: 106.698299,
      senderLat: 10.776889,
      senderLng: 106.700806,
      serviceType: "STANDARD",
    });
  });

  it("throws when the pickup address has not been selected from autocomplete", () => {
    expect(() =>
      mapCreateOrderInputToApiPayload({
        contactName: "Lan",
        contactPhone: "0909000001",
        customerName: "Công ty Emerald",
        declaredValueUsd: 0,
        delivery: createResolvedAddress("456 Điện Biên Phủ", "delivery-place", 10.773118, 106.698299),
        estimatedArrival: "",
        itemDescription: "",
        packageDimensions: "",
        packageWeightKg: 1,
        paymentMethod: "STRIPE",
        pickup: {
          address: "",
          isResolved: false,
          latitude: null,
          longitude: null,
          placeId: null,
          query: "123 Nguyễn Văn Linh",
        },
        receiverName: "",
        receiverPhone: "",
        serviceTier: "standard",
      }),
    ).toThrow("Địa chỉ lấy hàng chưa được chọn từ gợi ý địa chỉ hợp lệ.");
  });
});
