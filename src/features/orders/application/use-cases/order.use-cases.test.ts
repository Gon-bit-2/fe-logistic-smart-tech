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
      findStoredOrder: vi.fn(),
      patchStoredOrder: vi.fn(),
      upsertStoredOrder: vi.fn(),
    }));

    const { listOrdersUseCase } = await import("./order.use-cases");

    await expect(listOrdersUseCase()).rejects.toThrow(
      "Orders API chưa được cấu hình. Hãy thiết lập NEXT_PUBLIC_API_BASE_URL trước khi dùng luồng này.",
    );
  });

  it("returns an order from browser storage before calling the backend", async () => {
    const getOrderByIdRequest = vi.fn();
    const findStoredOrder = vi.fn().mockReturnValue(sampleOrder);

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
      findStoredOrder,
      patchStoredOrder: vi.fn(),
      upsertStoredOrder: vi.fn((order) => order),
    }));

    const { resolveCheckoutOrderUseCase } = await import("./order.use-cases");

    await expect(
      resolveCheckoutOrderUseCase({
        orderId: sampleOrder.id,
        reference: null,
      }),
    ).resolves.toEqual(sampleOrder);
    expect(findStoredOrder).toHaveBeenCalledWith(sampleOrder.id);
    expect(getOrderByIdRequest).not.toHaveBeenCalled();
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
      findStoredOrder: vi.fn().mockReturnValue(null),
      patchStoredOrder: vi.fn(),
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

  it("confirms checkout locally and persists the patched order", async () => {
    const upsertStoredOrder = vi.fn((order) => order);

    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: true,
    }));
    vi.doMock("@/features/orders/infrastructure/api/order.api", () => ({
      listOrdersRequest: vi.fn().mockResolvedValue(sampleOrdersPage),
      createOrderRequest: vi.fn(),
      getOrderQuoteRequest: vi.fn(),
      getOrderByIdRequest: vi.fn(),
      updateOrderStatusRequest: vi.fn(),
      deleteOrderRequest: vi.fn(),
    }));
    vi.doMock("@/features/orders/infrastructure/storage/order-session.storage", () => ({
      findStoredOrder: vi.fn().mockReturnValue(sampleOrder),
      patchStoredOrder: vi.fn().mockReturnValue({
        ...sampleOrder,
        status: "IN_TRANSIT",
        paymentMethod: "cash_on_delivery",
      }),
      upsertStoredOrder,
    }));

    const { confirmCheckoutUseCase } = await import("./order.use-cases");

    await expect(
      confirmCheckoutUseCase(sampleOrder, "cash_on_delivery"),
    ).resolves.toMatchObject({
      status: "IN_TRANSIT",
      paymentMethod: "cash_on_delivery",
    });
    expect(upsertStoredOrder).toHaveBeenCalled();
  });
});
