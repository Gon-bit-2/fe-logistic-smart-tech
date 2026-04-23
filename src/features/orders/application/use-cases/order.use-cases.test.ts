import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder, sampleOrdersPage } from "../../../../../tests/fixtures/api";

describe("order.use-cases", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("throws for list operations when the Orders API is not configured", async () => {
    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: false,
    }));
    vi.doMock("@/features/orders/infrastructure/api/order.api", () => ({
      listOrdersRequest: vi.fn(),
      createOrderRequest: vi.fn(),
      getOrderQuoteRequest: vi.fn(),
      getOrderByIdRequest: vi.fn(),
      updateOrderStatusRequest: vi.fn(),
      deleteOrderRequest: vi.fn(),
    }));
    vi.doMock("@/features/orders/infrastructure/storage/order-session.storage", () => ({
      upsertStoredOrder: vi.fn(),
    }));

    const { listOrdersUseCase } = await import("./order.use-cases");

    await expect(listOrdersUseCase()).rejects.toThrow(
      "Orders API chưa được cấu hình. Hãy thiết lập NEXT_PUBLIC_API_BASE_URL trước khi dùng luồng này.",
    );
  });

  it("prefers the backend order detail when orderId is available", async () => {
    const getOrderByIdRequest = vi.fn().mockResolvedValue({
      ...sampleOrder,
      status: "PENDING",
    });

    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: true,
    }));
    vi.doMock("@/features/orders/infrastructure/api/order.api", () => ({
      listOrdersRequest: vi.fn().mockResolvedValue(sampleOrdersPage),
      createOrderRequest: vi.fn(),
      getOrderQuoteRequest: vi.fn(),
      getOrderByIdRequest,
      updateOrderStatusRequest: vi.fn(),
      deleteOrderRequest: vi.fn(),
    }));
    vi.doMock("@/features/orders/infrastructure/storage/order-session.storage", () => ({
      upsertStoredOrder: vi.fn((order) => order),
    }));

    const { resolveCheckoutOrderUseCase } = await import("./order.use-cases");

    await expect(
      resolveCheckoutOrderUseCase({
        orderId: sampleOrder.id,
        reference: null,
      }),
    ).resolves.toMatchObject({
      id: sampleOrder.id,
      status: "PENDING",
    });
    expect(getOrderByIdRequest).toHaveBeenCalledWith(sampleOrder.id);
  });

  it("fetches an order from the backend when storage does not contain it", async () => {
    const getOrderByIdRequest = vi.fn().mockResolvedValue(sampleOrder);
    const upsertStoredOrder = vi.fn((order) => order);

    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: true,
    }));
    vi.doMock("@/features/orders/infrastructure/api/order.api", () => ({
      listOrdersRequest: vi.fn().mockResolvedValue(sampleOrdersPage),
      createOrderRequest: vi.fn(),
      getOrderQuoteRequest: vi.fn(),
      getOrderByIdRequest,
      updateOrderStatusRequest: vi.fn(),
      deleteOrderRequest: vi.fn(),
    }));
    vi.doMock("@/features/orders/infrastructure/storage/order-session.storage", () => ({
      upsertStoredOrder,
    }));

    const { resolveCheckoutOrderUseCase } = await import("./order.use-cases");

    await expect(
      resolveCheckoutOrderUseCase({
        orderId: sampleOrder.id,
        reference: null,
      }),
    ).resolves.toEqual(sampleOrder);
    expect(getOrderByIdRequest).toHaveBeenCalledWith(sampleOrder.id);
    expect(upsertStoredOrder).toHaveBeenCalledWith(sampleOrder);
  });

  it("surfaces the backend error when order detail cannot be loaded", async () => {
    const getOrderByIdRequest = vi.fn().mockRejectedValue(new Error("Network down"));

    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: true,
    }));
    vi.doMock("@/features/orders/infrastructure/api/order.api", () => ({
      listOrdersRequest: vi.fn().mockResolvedValue(sampleOrdersPage),
      createOrderRequest: vi.fn(),
      getOrderQuoteRequest: vi.fn(),
      getOrderByIdRequest,
      updateOrderStatusRequest: vi.fn(),
      deleteOrderRequest: vi.fn(),
    }));
    vi.doMock("@/features/orders/infrastructure/storage/order-session.storage", () => ({
      upsertStoredOrder: vi.fn((order) => order),
    }));

    const { resolveCheckoutOrderUseCase } = await import("./order.use-cases");

    await expect(
      resolveCheckoutOrderUseCase({
        orderId: sampleOrder.id,
        reference: null,
      }),
    ).rejects.toThrow("Network down");
  });

  it("resolves a single order by exact tracking code", async () => {
    const listOrdersRequest = vi.fn().mockResolvedValue({
      data: [sampleOrder],
      totalItems: 1,
    });

    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: true,
    }));
    vi.doMock("@/features/orders/infrastructure/api/order.api", () => ({
      listOrdersRequest,
      createOrderRequest: vi.fn(),
      getOrderQuoteRequest: vi.fn(),
      getOrderByIdRequest: vi.fn(),
      updateOrderStatusRequest: vi.fn(),
      deleteOrderRequest: vi.fn(),
    }));
    vi.doMock("@/features/orders/infrastructure/storage/order-session.storage", () => ({
      upsertStoredOrder: vi.fn((order) => order),
    }));

    const { resolveOrderByTrackingCodeUseCase } = await import("./order.use-cases");

    await expect(
      resolveOrderByTrackingCodeUseCase("  GT-ORD-20260003  "),
    ).resolves.toEqual(sampleOrder);
    expect(listOrdersRequest).toHaveBeenCalledWith({
      limit: 2,
      page: 1,
      trackingCode: "GT-ORD-20260003",
    });
  });

  it("throws when tracking lookup returns no order", async () => {
    const listOrdersRequest = vi.fn().mockResolvedValue({
      data: [],
      totalItems: 0,
    });

    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: true,
    }));
    vi.doMock("@/features/orders/infrastructure/api/order.api", () => ({
      listOrdersRequest,
      createOrderRequest: vi.fn(),
      getOrderQuoteRequest: vi.fn(),
      getOrderByIdRequest: vi.fn(),
      updateOrderStatusRequest: vi.fn(),
      deleteOrderRequest: vi.fn(),
    }));
    vi.doMock("@/features/orders/infrastructure/storage/order-session.storage", () => ({
      upsertStoredOrder: vi.fn((order) => order),
    }));

    const { resolveOrderByTrackingCodeUseCase } = await import("./order.use-cases");

    await expect(resolveOrderByTrackingCodeUseCase("MISSING")).rejects.toThrow(
      "Không tìm thấy đơn hàng với mã MISSING.",
    );
  });
});
