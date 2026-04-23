import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder } from "../../../../../tests/fixtures/api";
import { sampleTrackingViewModel } from "../../../../../tests/fixtures/api";
import { ApiError } from "@/lib/api/errors";
import { trackingDetailCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import TrackingDetailScreen from "./TrackingDetailScreen";

const usePublicTrackingQueryMock = vi.fn();
const useResolvedTrackingOrderMock = vi.fn();
const useCancelOrderMock = vi.fn();

vi.mock("@/features/tracking/presentation/hooks/usePublicTrackingQuery", () => ({
  usePublicTrackingQuery: (trackingCode: string) => usePublicTrackingQueryMock(trackingCode),
}));

vi.mock("@/features/orders/presentation/hooks/useResolvedTrackingOrder", () => ({
  useResolvedTrackingOrder: (trackingCode: string) =>
    useResolvedTrackingOrderMock(trackingCode),
}));

vi.mock("@/features/orders/presentation/hooks/useCancelOrder", () => ({
  useCancelOrder: () => useCancelOrderMock(),
}));

describe("TrackingDetailScreen", () => {
  beforeEach(() => {
    usePublicTrackingQueryMock.mockReset();
    useResolvedTrackingOrderMock.mockReset();
    useCancelOrderMock.mockReset();
    useCancelOrderMock.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
    useResolvedTrackingOrderMock.mockReturnValue({
      data: null,
      error: new ApiError({
        message: "Unauthorized",
        status: 401,
      }),
    });
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      share: undefined,
    });
  });

  it("renders the loading state while tracking data is pending", () => {
    usePublicTrackingQueryMock.mockReturnValue({
      data: null,
      error: null,
      isPending: true,
      refetch: vi.fn(),
    });

    renderWithProviders(<TrackingDetailScreen trackingCode="ELG-2026-0001" />);

    expect(screen.getByText(trackingDetailCopy.loadingTitle)).toBeInTheDocument();
  });

  it("renders the tracking timeline when data is available", () => {
    usePublicTrackingQueryMock.mockReturnValue({
      data: sampleTrackingViewModel,
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<TrackingDetailScreen trackingCode={sampleTrackingViewModel.trackingCode} />);

    expect(
      screen.getAllByText(sampleTrackingViewModel.trackingCode).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Minh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Đang vận chuyển").length).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: trackingDetailCopy.payNow })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: trackingDetailCopy.cancelOrder })).not.toBeInTheDocument();
  });

  it("renders a not-found message and retries on demand", () => {
    const refetch = vi.fn();
    usePublicTrackingQueryMock.mockReturnValue({
      data: null,
      error: new ApiError({
        message: "Không tìm thấy lô hàng",
        status: 404,
      }),
      isPending: false,
      refetch,
    });

    renderWithProviders(<TrackingDetailScreen trackingCode="MISSING" />);

    expect(screen.getByText(trackingDetailCopy.notFoundTitle)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: trackingDetailCopy.retry }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows a payment CTA for authenticated customer orders pending Stripe payment", () => {
    usePublicTrackingQueryMock.mockReturnValue({
      data: sampleTrackingViewModel,
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useResolvedTrackingOrderMock.mockReturnValue({
      data: {
        ...sampleOrder,
        id: "21",
        payment: {
          ...sampleOrder.payment!,
          method: "STRIPE",
          status: "PENDING",
        },
        status: "PENDING",
        trackingCode: sampleTrackingViewModel.trackingCode,
      },
      error: null,
    });

    renderWithProviders(<TrackingDetailScreen trackingCode={sampleTrackingViewModel.trackingCode} />);

    expect(screen.getByRole("link", { name: trackingDetailCopy.payNow })).toHaveAttribute(
      "href",
      "/checkout?orderId=21",
    );
    expect(screen.getByRole("button", { name: trackingDetailCopy.cancelOrder })).toBeInTheDocument();
  });

  it("hides the payment CTA for COD orders and keeps cancel only when status is cancelable", () => {
    usePublicTrackingQueryMock.mockReturnValue({
      data: sampleTrackingViewModel,
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useResolvedTrackingOrderMock.mockReturnValue({
      data: {
        ...sampleOrder,
        payment: {
          ...sampleOrder.payment!,
          method: "COD",
          status: "PENDING",
        },
        status: "ASSIGNED",
        trackingCode: sampleTrackingViewModel.trackingCode,
      },
      error: null,
    });

    renderWithProviders(<TrackingDetailScreen trackingCode={sampleTrackingViewModel.trackingCode} />);

    expect(screen.queryByRole("link", { name: trackingDetailCopy.payNow })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: trackingDetailCopy.cancelOrder })).toBeInTheDocument();
  });

  it("keeps the cancelled order visible without cancel CTA and allows sharing fallback", async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: {
        writeText: clipboardWriteText,
      },
      share: undefined,
    });
    usePublicTrackingQueryMock.mockReturnValue({
      data: {
        ...sampleTrackingViewModel,
        currentStatus: "CANCELLED",
        events: [
          {
            ...sampleTrackingViewModel.events[0],
            label: "Đã huỷ",
            status: "current",
          },
        ],
      },
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useResolvedTrackingOrderMock.mockReturnValue({
      data: {
        ...sampleOrder,
        status: "CANCELLED",
        trackingCode: sampleTrackingViewModel.trackingCode,
      },
      error: null,
    });

    renderWithProviders(<TrackingDetailScreen trackingCode={sampleTrackingViewModel.trackingCode} />);

    expect(screen.getAllByText("Đã huỷ").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: trackingDetailCopy.cancelOrder })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: trackingDetailCopy.shareTracking }));

    await waitFor(() => {
      expect(clipboardWriteText).toHaveBeenCalledWith(
        `http://localhost:3000/tracking/${sampleTrackingViewModel.trackingCode}`,
      );
      expect(screen.getByText(trackingDetailCopy.copySuccess)).toBeInTheDocument();
    });
  });
});
