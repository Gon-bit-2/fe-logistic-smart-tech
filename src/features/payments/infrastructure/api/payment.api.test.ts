import { beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.fn();
const get = vi.fn();

vi.mock("@/lib/api/http-client", () => ({
  httpClient: {
    get,
    post,
  },
}));

describe("payment.api", () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
  });

  it("sends create intent requests with a timeout", async () => {
    post.mockResolvedValue({
      data: {
        amount: 26090,
        clientSecret: "pi_secret",
        transactionId: "pi_123",
      },
    });

    const { createPaymentIntentRequest } = await import("./payment.api");

    await createPaymentIntentRequest("order-1");

    expect(post).toHaveBeenCalledWith(
      "/payments/create-intent/order-1",
      undefined,
      expect.objectContaining({
        timeout: 15000,
      }),
    );
  });

  it("maps payment records using the backend `method` field", async () => {
    get.mockResolvedValue({
      data: {
        amount: "42500",
        method: "STRIPE",
        orderId: 21,
        paidAt: null,
        status: "PENDING",
        transactionId: "pi_123",
      },
    });

    const { getPaymentByOrderRequest } = await import("./payment.api");

    await expect(getPaymentByOrderRequest("21")).resolves.toEqual({
      amount: 42500,
      method: "STRIPE",
      orderId: "21",
      paidAt: null,
      status: "PENDING",
      transactionId: "pi_123",
    });
  });
});
