import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder } from "../../../../../tests/fixtures/api";
import { renderWithProviders } from "@/test/render";
import AdminOrderDetailScreen from "./AdminOrderDetailScreen";

const useOrderDetailQueryMock = vi.fn();
const useCancelOrderMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useOrderDetail", () => ({
  useOrderDetailQuery: (orderId: string) => useOrderDetailQueryMock(orderId),
}));

vi.mock("@/features/orders/presentation/hooks/useCancelOrder", () => ({
  useCancelOrder: () => useCancelOrderMock(),
}));

vi.mock("@/features/tracking/presentation/screens/InternalTrackingWorkspace", () => ({
  default: ({ orderId }: { orderId?: string }) => (
    <div data-testid="internal-tracking-workspace">{orderId}</div>
  ),
}));

describe("AdminOrderDetailScreen", () => {
  beforeEach(() => {
    useOrderDetailQueryMock.mockReset();
    useCancelOrderMock.mockReset();
    useCancelOrderMock.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
    useOrderDetailQueryMock.mockReturnValue({
      data: {
        ...sampleOrder,
        id: "21",
        trackingCode: "GT-ORD-20260021",
        status: "PENDING",
      },
      error: null,
      isError: false,
      isLoading: false,
      isPending: false,
    });
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  it("renders internal admin detail and links back to the admin shipment list", () => {
    renderWithProviders(<AdminOrderDetailScreen orderId="21" />);

    expect(screen.getByRole("link", { name: "Quay lại danh sách lô hàng" })).toHaveAttribute(
      "href",
      expect.stringContaining("/dashboard/admin/orders"),
    );
    expect(screen.getByText("GT-ORD-20260021")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Xem tracking công khai" })).toHaveAttribute(
      "href",
      expect.stringContaining("/tracking/GT-ORD-20260021"),
    );
    expect(screen.getByTestId("internal-tracking-workspace")).toHaveTextContent("21");
  });

  it("allows admin to cancel a cancelable order from the internal detail page", async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    useCancelOrderMock.mockReturnValue({
      isPending: false,
      mutateAsync,
    });

    renderWithProviders(<AdminOrderDetailScreen orderId="21" />);

    fireEvent.click(screen.getByRole("button", { name: "Hủy đơn" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith("21");
      expect(screen.getByText("Đơn hàng đã được hủy thành công.")).toBeInTheDocument();
    });
  });
});
