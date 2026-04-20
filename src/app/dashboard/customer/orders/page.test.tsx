"use client";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { emptyOrdersPage, sampleOrdersPage } from "../../../../../tests/fixtures/api";
import { renderWithProviders } from "@/test/render";
import CustomerOrdersPage from "./page";

const useOrdersListQueryMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useOrdersListQuery", () => ({
  useOrdersListQuery: (params?: unknown) => useOrdersListQueryMock(params),
}));

describe("CustomerOrdersPage", () => {
  beforeEach(() => {
    useOrdersListQueryMock.mockReset();
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
      data: sampleOrdersPage,
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerOrdersPage />);

    expect(screen.getByText(sampleOrdersPage.data[0].reference)).toBeInTheDocument();
    expect(screen.getByText(sampleOrdersPage.data[0].status)).toBeInTheDocument();
  });
});
