import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder, sampleVehicleList } from "../../../../../tests/fixtures/api";
import viMessages from "@/messages/vi.json";
const adminScreenCopy = viMessages.admin.screen;
import { renderWithProviders } from "@/test/render";
import DispatcherDashboardScreen from "./DispatcherDashboardScreen";

const useDispatcherMetricsMock = vi.fn();

vi.mock("@/features/admin/presentation/hooks/useDispatcherMetrics", () => ({
  useDispatcherMetrics: () => useDispatcherMetricsMock(),
}));

describe("DispatcherDashboardScreen", () => {
  beforeEach(() => {
    useDispatcherMetricsMock.mockReset();
  });

  it("renders an error state when orders fail to load", () => {
    useDispatcherMetricsMock.mockReturnValue({
      metrics: {
        activeOrders: 0,
        availableVehicles: 0,
        electricVehicles: 0,
      },
      orders: [],
      ordersQuery: {
        isPending: false,
        isError: true,
        error: new Error("Orders API down"),
        refetch: vi.fn(),
      },
      vehiclesQuery: {
        isPending: false,
        isError: false,
      },
    });

    renderWithProviders(<DispatcherDashboardScreen />);

    expect(screen.getByText(adminScreenCopy.emptyTitle)).toBeInTheDocument();
    expect(screen.getByText("Orders API down")).toBeInTheDocument();
  });

  it("renders recent orders and metrics when data is available", () => {
    useDispatcherMetricsMock.mockReturnValue({
      metrics: {
        activeOrders: 1,
        availableVehicles: 1,
        electricVehicles: 1,
      },
      orders: [sampleOrder],
      ordersQuery: {
        isPending: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      },
      vehiclesQuery: {
        isPending: false,
        isError: false,
        data: sampleVehicleList,
      },
    });

    renderWithProviders(<DispatcherDashboardScreen />);

    expect(screen.getByText(adminScreenCopy.title)).toBeInTheDocument();
    expect(screen.getByText(sampleOrder.reference)).toBeInTheDocument();
    expect(screen.getByText(sampleOrder.customerName)).toBeInTheDocument();
  });
});
