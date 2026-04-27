import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import ShipmentsManagementScreen from "./ShipmentsManagementScreen";

const useOrdersListQueryMock = vi.fn();
const useCancelOrderMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useOrdersListQuery", () => ({
  useOrdersListQuery: () => useOrdersListQueryMock(),
}));

vi.mock("@/features/orders/presentation/hooks/useCancelOrder", () => ({
  useCancelOrder: () => useCancelOrderMock(),
}));

describe("ShipmentsManagementScreen", () => {
  beforeEach(() => {
    useOrdersListQueryMock.mockReset();
    useCancelOrderMock.mockReset();
    useCancelOrderMock.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
    useOrdersListQueryMock.mockReturnValue({
      data: {
        data: [
          {
            id: "15",
            reference: "GT-ORD-20260015",
            customerName: "Công ty A",
            pickupAddress: "Quận 7",
            deliveryAddress: "Bình Thạnh",
            estimatedArrival: "2026-04-28T06:26:00.000Z",
            status: "PENDING",
          },
        ],
        totalItems: 1,
      },
      isError: false,
      isLoading: false,
    });
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  it("renders admin actions for shipment detail and cancellation", () => {
    renderWithProviders(<ShipmentsManagementScreen />);

    expect(screen.getByRole("link", { name: "Xem chi tiết" })).toHaveAttribute(
      "href",
      expect.stringContaining("/dashboard/admin/orders/15"),
    );
    expect(screen.getByRole("button", { name: "Hủy đơn" })).toBeInTheDocument();
  });

  it("cancels a shipment from the admin list", async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    useCancelOrderMock.mockReturnValue({
      isPending: false,
      mutateAsync,
    });

    renderWithProviders(<ShipmentsManagementScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Hủy đơn" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith("15");
      expect(screen.getByText("Đơn hàng đã được hủy thành công.")).toBeInTheDocument();
    });
  });
});
