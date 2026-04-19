import { act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder } from "../../../../../tests/fixtures/api";
import { renderHookWithProviders } from "@/test/render";
import { useCheckout } from "./useCheckout";

const { confirmCheckoutUseCase, resolveCheckoutOrderUseCase } = vi.hoisted(() => ({
  confirmCheckoutUseCase: vi.fn(),
  resolveCheckoutOrderUseCase: vi.fn(),
}));

vi.mock("@/features/orders/application/use-cases/order.use-cases", () => ({
  confirmCheckoutUseCase,
  resolveCheckoutOrderUseCase,
}));

describe("useCheckout", () => {
  beforeEach(() => {
    confirmCheckoutUseCase.mockReset();
    resolveCheckoutOrderUseCase.mockReset();
  });

  it("reports an error when no order is available in the URL", async () => {
    const { result } = renderHookWithProviders(() => useCheckout());

    await act(async () => {
      await result.current.confirmCheckout();
    });

    expect(result.current.error).toBe("Không thể tải đơn hàng để thanh toán.");
    expect(resolveCheckoutOrderUseCase).not.toHaveBeenCalled();
  });

  it("requires card fields before confirming card payments", async () => {
    resolveCheckoutOrderUseCase.mockResolvedValue(sampleOrder);

    const { result } = renderHookWithProviders(() => useCheckout(), {
      searchParams: {
        orderId: sampleOrder.id,
      },
    });

    await waitFor(() => {
      expect(result.current.order?.id).toBe(sampleOrder.id);
    });

    await act(async () => {
      await result.current.confirmCheckout();
    });

    expect(result.current.error).toBe(
      "Vui lòng nhập số thẻ, ngày hết hạn và CVC để tiếp tục.",
    );
    expect(confirmCheckoutUseCase).not.toHaveBeenCalled();
  });

  it("confirms COD orders and redirects to tracking", async () => {
    resolveCheckoutOrderUseCase.mockResolvedValue(sampleOrder);
    confirmCheckoutUseCase.mockResolvedValue({
      ...sampleOrder,
      paymentMethod: "cash_on_delivery",
      status: "IN_TRANSIT",
    });

    const { result, router } = renderHookWithProviders(() => useCheckout(), {
      searchParams: {
        orderId: sampleOrder.id,
      },
    });

    await waitFor(() => {
      expect(result.current.order?.id).toBe(sampleOrder.id);
    });

    act(() => {
      result.current.setPaymentMethod("cash_on_delivery");
    });

    await act(async () => {
      await result.current.confirmCheckout();
    });

    expect(confirmCheckoutUseCase).toHaveBeenCalledWith(
      sampleOrder,
      "cash_on_delivery",
    );
    expect(router.push).toHaveBeenCalledWith(`/tracking/${sampleOrder.reference}`);
  });
});
