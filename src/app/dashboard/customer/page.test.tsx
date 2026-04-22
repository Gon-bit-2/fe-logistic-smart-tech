"use client";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrdersPage } from "../../../../tests/fixtures/api";
import { renderWithProviders } from "@/test/render";
import CustomerDashboardPage from "./page";

const useOrdersListQueryMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useOrdersListQuery", () => ({
  useOrdersListQuery: (params?: unknown) => useOrdersListQueryMock(params),
}));

describe("CustomerDashboardPage", () => {
  beforeEach(() => {
    useOrdersListQueryMock.mockReset();
  });

  it("uses the latest order payment summary without fetching payment separately", () => {
    useOrdersListQueryMock.mockReturnValue({
      data: sampleOrdersPage,
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerDashboardPage />);

    expect(screen.getByText("Chờ thanh toán")).toBeInTheDocument();
    expect(screen.getByText(`Đơn gần nhất: ${sampleOrdersPage.data[0].reference}.`)).toBeInTheDocument();
  });

  it("only aggregates delivered orders for the CO2 summary", () => {
    useOrdersListQueryMock.mockReturnValue({
      data: {
        data: [
          sampleOrdersPage.data[0],
          {
            ...sampleOrdersPage.data[0],
            id: "ord-delivered",
            reference: "ELG-2026-DELIVERED",
            status: "DELIVERED",
            co2SavedKg: 5.5,
          },
        ],
        totalItems: 2,
      },
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<CustomerDashboardPage />);

    expect(screen.getByText("5.5")).toBeInTheDocument();
    expect(screen.getByText("Theo dữ liệu đơn hàng hiện có.")).toBeInTheDocument();
  });
});
