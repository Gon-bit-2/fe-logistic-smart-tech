"use client";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import WarehouseOrdersPage from "./page";

const useOrdersListQueryMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useOrdersListQuery", () => ({
  useOrdersListQuery: (params?: unknown) => useOrdersListQueryMock(params),
}));

describe("WarehouseOrdersPage", () => {
  beforeEach(() => {
    useOrdersListQueryMock.mockReset();
    useOrdersListQueryMock.mockReturnValue({
      data: {
        data: [
          {
            id: "1",
            trackingCode: "GONLG5546014627",
            reference: "GONLG5546014627",
            customerName: "ABCD",
            pickupAddress: "Xã Long An",
            deliveryAddress: "Quận 10, Hồ Chí Minh",
            receiverName: "ABCD",
            status: "PENDING",
            packageWeightKg: 5,
          },
        ],
        totalItems: 1,
      },
      error: null,
      isError: false,
      isLoading: false,
    });
  });

  it("renders import/export shortcuts and translated warehouse statuses", () => {
    renderWithProviders(<WarehouseOrdersPage />);

    expect(screen.getByRole("link", { name: "Nhập kho" })).toHaveAttribute(
      "href",
      expect.stringContaining("/dashboard/warehouse?mode=inbound"),
    );
    expect(screen.getByRole("link", { name: "Xuất kho" })).toHaveAttribute(
      "href",
      expect.stringContaining("/dashboard/warehouse?mode=outbound"),
    );
    expect(screen.getAllByText("Chờ xác nhận").length).toBeGreaterThan(0);
  });
});
