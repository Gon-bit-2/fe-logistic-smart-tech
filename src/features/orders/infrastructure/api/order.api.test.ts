import { beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.fn();
const get = vi.fn();
const put = vi.fn();
const patch = vi.fn();
const del = vi.fn();

vi.mock("@/lib/api/http-client", () => ({
  httpClient: {
    delete: del,
    get,
    patch,
    post,
    put,
  },
}));

describe("order.api", () => {
  beforeEach(() => {
    del.mockReset();
    get.mockReset();
    patch.mockReset();
    post.mockReset();
    put.mockReset();
  });

  it("maps the flat backend quote response into the frontend quote view model", async () => {
    post.mockResolvedValue({
      data: {
        currency: "VND",
        distanceMeters: 5200,
        durationSeconds: 1200,
        estimatedCo2Saved: 0.0625,
        polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
        shippingFee: 42500,
      },
    });

    const { getOrderQuoteRequest } = await import("./order.api");

    const quote = await getOrderQuoteRequest({
      contactName: "Lan",
      contactPhone: "0909000001",
      customerName: "",
      declaredValueUsd: 0,
      delivery: {
        address: "456 Dien Bien Phu",
        isResolved: true,
        latitude: 10.773118,
        longitude: 106.698299,
        placeId: "delivery-place",
        query: "456 Dien Bien Phu",
      },
      estimatedArrival: "",
      itemDescription: "Thiet bi dien tu",
      packageDimensions: "40x30x20",
      packageWeightKg: 25,
      paymentMethod: "STRIPE",
      pickup: {
        address: "123 Nguyen Van Linh",
        isResolved: true,
        latitude: 10.776889,
        longitude: 106.700806,
        placeId: "pickup-place",
        query: "123 Nguyen Van Linh",
      },
      receiverName: "Minh",
      receiverPhone: "0909000002",
      serviceTier: "eco_green",
    });

    expect(quote).toEqual({
      quote: {
        currency: "VND",
        distanceKm: 5.2,
        durationSeconds: 1200,
        estimatedCo2Saved: 0.0625,
        shippingFee: 42500,
        totalVolume: 0,
        totalWeight: 0,
      },
      routes: [
        {
          distanceMeters: 5200,
          distanceText: "5.2 km",
          durationSeconds: 1200,
          durationText: "",
          polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
        },
      ],
    });
    expect(post).toHaveBeenCalledWith(
      "/orders/quote",
      expect.objectContaining({
        receiverAddress: "456 Dien Bien Phu",
        receiverLat: 10.773118,
        receiverLng: 106.698299,
        receiverName: "Minh",
        receiverPhone: "0909000002",
        senderAddress: "123 Nguyen Van Linh",
        senderLat: 10.776889,
        senderLng: 106.700806,
        senderName: "Lan",
        senderPhone: "0909000001",
        serviceType: "ECO_GREEN",
      }),
    );
  });

  it("calls the dedicated cancel endpoint and maps the cancelled order", async () => {
    patch.mockResolvedValue({
      data: {
        id: 21,
        payment: {
          amount: 42500,
          method: "STRIPE",
          orderId: 21,
          paidAt: null,
          status: "PENDING",
          transactionId: "pi_123",
        },
        receiverAddress: "456 Dien Bien Phu",
        reference: "ELG-2026-0001",
        senderAddress: "123 Nguyen Van Linh",
        status: "CANCELLED",
        trackingCode: "GT-ORD-20260003",
      },
    });

    const { cancelOrderRequest } = await import("./order.api");

    await expect(cancelOrderRequest("21")).resolves.toEqual(
      expect.objectContaining({
        id: "21",
        status: "CANCELLED",
        trackingCode: "GT-ORD-20260003",
      }),
    );
    expect(patch).toHaveBeenCalledWith("/orders/21/cancel");
  });
});
