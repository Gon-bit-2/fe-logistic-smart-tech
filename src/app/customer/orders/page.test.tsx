"use client";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { emptyOrdersPage, sampleOrdersPage } from "../../../../tests/fixtures/api";
import { renderWithProviders } from "@/test/render";
import CustomerOrdersPage from "./page";

const useOrdersListQueryMock = vi.fn();
const useCancelOrderMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useOrdersListQuery", () => ({
  useOrdersListQuery: (params?: unknown) => useOrdersListQueryMock(params),
}));

vi.mock("@/features/orders/presentation/hooks/useCancelOrder", () => ({
  useCancelOrder: () => useCancelOrderMock(),
}));

describe("CustomerOrdersPage", () => {
  beforeEach(() => {
    useOrdersListQueryMock.mockReset();
    useCancelOrderMock.mockReset();
    useCancelOrderMock.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("renders a loading row while orders are being fetched", () => {
    useOrdersListQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: true,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("renders an empty state when no orders match the filters", () => {
    useOrdersListQueryMock.mockReturnValue({
      data: emptyOrdersPage,
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.getByText("Không tìm thấy đơn hàng nào.")).toBeInTheDocument();
  });

  it("renders order rows from the paginated response data", () => {
    useOrdersListQueryMock.mockReturnValue({
      data: {
        ...sampleOrdersPage,
        data: [
          {
            ...sampleOrdersPage.data[0],
            status: "PENDING",
          },
        ],
      },
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.getByText(sampleOrdersPage.data[0].reference)).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
    expect(screen.getByText("Stripe • Chờ thanh toán")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Thanh toán" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hủy đơn" })).toBeInTheDocument();
  });

  it("hides the payment CTA for COD or completed orders", () => {
    useOrdersListQueryMock.mockReturnValue({
      data: {
        data: [
          {
            ...sampleOrdersPage.data[0],
            payment: {
              ...sampleOrdersPage.data[0].payment,
              method: "COD",
              status: "PENDING",
            },
          },
          {
            ...sampleOrdersPage.data[0],
            id: "order-completed",
            reference: "ELG-2026-PAID",
            payment: {
              ...sampleOrdersPage.data[0].payment,
              method: "STRIPE",
              status: "COMPLETED",
            },
          },
        ],
        totalItems: 2,
      },
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.queryByRole("link", { name: "Thanh toán" })).not.toBeInTheDocument();
  });

  it("calls the cancel mutation for orders in PENDING or ASSIGNED", async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);

    useCancelOrderMock.mockReturnValue({
      isPending: false,
      mutateAsync,
    });
    useOrdersListQueryMock.mockReturnValue({
      data: {
        data: [
          {
            ...sampleOrdersPage.data[0],
            id: "pending-order",
            status: "ASSIGNED",
          },
        ],
        totalItems: 1,
      },
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    });
    vi.stubGlobal("confirm", vi.fn(() => true));

    renderWithProviders(<CustomerOrdersPage />);

    fireEvent.click(screen.getByRole("button", { name: "Hủy đơn" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith("pending-order");
      expect(screen.getByText("Đơn hàng đã được hủy thành công.")).toBeInTheDocument();
    });
  });
});
