import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  sampleAnalyticsMetrics,
  sampleFleetPerformance,
} from "../../../../../tests/fixtures/api";
import { renderWithProviders } from "@/test/render";
import AnalyticsDashboardScreen from "./AnalyticsDashboardScreen";

const useDashboardAnalyticsMock = vi.fn();
const useFleetPerformanceMock = vi.fn();

vi.mock("@/features/analytics/presentation/hooks/useDashboardAnalytics", () => ({
  useDashboardAnalytics: () => useDashboardAnalyticsMock(),
}));

vi.mock("@/features/analytics/presentation/hooks/useFleetPerformance", () => ({
  useFleetPerformance: () => useFleetPerformanceMock(),
}));

describe("AnalyticsDashboardScreen", () => {
  beforeEach(() => {
    useDashboardAnalyticsMock.mockReset();
    useFleetPerformanceMock.mockReset();
  });

  it("renders an error panel when analytics queries fail", () => {
    useDashboardAnalyticsMock.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });
    useFleetPerformanceMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
    });

    renderWithProviders(<AnalyticsDashboardScreen />);

    expect(screen.getByText("Lỗi tải dữ liệu")).toBeInTheDocument();
  });

  it("renders KPI cards and fleet rows when analytics data is available", () => {
    useDashboardAnalyticsMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: sampleAnalyticsMetrics,
    });
    useFleetPerformanceMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: sampleFleetPerformance,
    });

    renderWithProviders(<AnalyticsDashboardScreen />);

    expect(screen.getByText(sampleAnalyticsMetrics[0].label)).toBeInTheDocument();
    expect(screen.getByText(sampleFleetPerformance[0].vehicleInfo)).toBeInTheDocument();
  });
});
