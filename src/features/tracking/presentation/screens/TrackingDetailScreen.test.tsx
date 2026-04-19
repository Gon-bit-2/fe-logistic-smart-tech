import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleTrackingViewModel } from "../../../../../tests/fixtures/api";
import { ApiError } from "@/lib/api/errors";
import { trackingDetailCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import TrackingDetailScreen from "./TrackingDetailScreen";

const usePublicTrackingQueryMock = vi.fn();

vi.mock("@/features/tracking/presentation/hooks/usePublicTrackingQuery", () => ({
  usePublicTrackingQuery: (trackingCode: string) => usePublicTrackingQueryMock(trackingCode),
}));

describe("TrackingDetailScreen", () => {
  beforeEach(() => {
    usePublicTrackingQueryMock.mockReset();
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
});
