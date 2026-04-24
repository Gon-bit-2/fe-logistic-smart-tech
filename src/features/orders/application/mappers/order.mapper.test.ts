import { describe, expect, it } from "vitest";
import { mapOrderApiToViewModel } from "./order.mapper";

describe("mapOrderApiToViewModel", () => {
  it("preserves sender/receiver coordinates and routing references", () => {
    const viewModel = mapOrderApiToViewModel({
      currentHubId: 7,
      currentTripId: 21,
      id: 101,
      receiverAddress: "456 Le Loi, Quan 1, TP HCM",
      receiverLat: 10.773118,
      receiverLng: 106.698299,
      receiverName: "Tran Thi B",
      receiverPhone: "0911111111",
      senderAddress: "123 Nguyen Trai, Quan 1, TP HCM",
      senderLat: 10.776889,
      senderLng: 106.700806,
      senderName: "Nguyen Van A",
      senderPhone: "0900000000",
      payment: {
        amount: "42500",
        method: "STRIPE",
        orderId: 101,
        paidAt: null,
        status: "PENDING",
        transactionId: "pi_123",
      },
      serviceType: "STANDARD",
      shippingFee: 42500,
      status: "PENDING",
      trackingCode: "cmabc123xyz",
    });

    expect(viewModel).toMatchObject({
      currentHubId: 7,
      currentTripId: 21,
      deliveryAddress: "456 Le Loi, Quan 1, TP HCM",
      pickupAddress: "123 Nguyen Trai, Quan 1, TP HCM",
      payment: {
        amount: 42500,
        method: "STRIPE",
        orderId: "101",
        paidAt: null,
        status: "PENDING",
        transactionId: "pi_123",
      },
      receiverLat: 10.773118,
      receiverLng: 106.698299,
      senderLat: 10.776889,
      senderLng: 106.700806,
      trackingCode: "cmabc123xyz",
    });
  });

  it("uses the tracking code as the customer-facing reference when reference is missing", () => {
    const viewModel = mapOrderApiToViewModel({
      id: 202,
      receiverAddress: "Kho B",
      senderAddress: "Kho A",
      status: "DELIVERED",
      trackingCode: "TRK-20260421",
    });

    expect(viewModel.reference).toBe("TRK-20260421");
    expect(viewModel.trackingCode).toBe("TRK-20260421");
  });
});
