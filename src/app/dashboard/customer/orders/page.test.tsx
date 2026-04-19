"use client";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { emptyOrdersPage, sampleOrdersPage } from "../../../../../tests/fixtures/api";
import { renderWithProviders } from "@/test/render";
import CustomerOrdersPage from "./page";

const useListOrdersMock = vi.fn();

vi.mock("@/features/orders/application/use-cases/use-list-orders", () => ({
  useListOrders: (params?: unknown) => useListOrdersMock(params),
}));

describe("CustomerOrdersPage", () => {
  beforeEach(() => {
    useListOrdersMock.mockReset();
  });

  it("renders a loading row while orders are being fetched", () => {
    useListOrdersMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("renders an empty state when no orders match the filters", () => {
    useListOrdersMock.mockReturnValue({
      data: emptyOrdersPage,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.getByText("Không tìm thấy đơn hàng nào.")).toBeInTheDocument();
  });

  it("renders order rows from the paginated response data", () => {
    useListOrdersMock.mockReturnValue({
      data: sampleOrdersPage,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.getByText(sampleOrdersPage.data[0].reference)).toBeInTheDocument();
    expect(screen.getByText(sampleOrdersPage.data[0].status)).toBeInTheDocument();
  });
});
