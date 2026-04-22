import { waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder } from "../../../../../tests/fixtures/api";
import { renderHookWithProviders } from "@/test/render";
import { useCheckout } from "./useCheckout";

const { resolveCheckoutOrderUseCase, usePaymentRecord } = vi.hoisted(() => ({
  resolveCheckoutOrderUseCase: vi.fn(),
  usePaymentRecord: vi.fn(),
}));

vi.mock("@/features/orders/application/use-cases/order.use-cases", () => ({
  resolveCheckoutOrderUseCase,
}));

vi.mock("@/features/payments/presentation/hooks/usePaymentIntent", () => ({
  usePaymentRecord,
}));

describe("useCheckout", () => {
  beforeEach(() => {
    resolveCheckoutOrderUseCase.mockReset();
    usePaymentRecord.mockReset();
    usePaymentRecord.mockReturnValue({
      data: null,
      error: null,
      isPending: false,
    });
  });

  it("does not fetch when checkout URL has no order context", () => {
    const { result } = renderHookWithProviders(() => useCheckout());

    expect(result.current.order).toBeNull();
    expect(result.current.loadError).toBeNull();
    expect(resolveCheckoutOrderUseCase).not.toHaveBeenCalled();
  });

  it("loads the checkout order and payment record from their respective queries", async () => {
    resolveCheckoutOrderUseCase.mockResolvedValue(sampleOrder);
    usePaymentRecord.mockReturnValue({
      data: sampleOrder.payment,
      error: null,
      isPending: false,
    });

    const { result } = renderHookWithProviders(() => useCheckout(), {
      searchParams: {
        orderId: sampleOrder.id,
      },
    });

    await waitFor(() => {
      expect(result.current.order?.id).toBe(sampleOrder.id);
    });

    expect(result.current.paymentRecord).toEqual(sampleOrder.payment);
    expect(usePaymentRecord).toHaveBeenCalledWith(sampleOrder.id);
  });

  it("surfaces checkout load errors from the order query", async () => {
    resolveCheckoutOrderUseCase.mockRejectedValue(new Error("Không tải được order"));

    const { result } = renderHookWithProviders(() => useCheckout(), {
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
      searchParams: {
        orderId: sampleOrder.id,
      },
    });

    await waitFor(() => {
      expect(result.current.loadError).toBe("Không tải được order");
    });
    expect(result.current.order).toBeNull();
  });
});
