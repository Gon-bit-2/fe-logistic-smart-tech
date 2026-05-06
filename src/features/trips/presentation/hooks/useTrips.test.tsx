import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "@/test/render";
import { useOptimizeTripRoute } from "./useTrips";

const { optimizeTripRouteUseCase } = vi.hoisted(() => ({
  optimizeTripRouteUseCase: vi.fn(),
}));

vi.mock("@/features/trips/application/use-cases/trip.use-cases", () => ({
  addOrdersToTripUseCase: vi.fn(),
  approveAssignmentRequestUseCase: vi.fn(),
  assignmentRequestInboxUseCase: vi.fn(),
  autoDispatchUseCase: vi.fn(),
  assignVehicleToTripUseCase: vi.fn(),
  createDriverAssignmentRequestUseCase: vi.fn(),
  dispatchApproveUseCase: vi.fn(),
  dispatchBoardUseCase: vi.fn(),
  dispatchPreviewUseCase: vi.fn(),
  driverDispatchBoardUseCase: vi.fn(),
  getTripDetailUseCase: vi.fn(),
  listDriverAssignmentRequestsUseCase: vi.fn(),
  listTripsUseCase: vi.fn(),
  manualCreateTripUseCase: vi.fn(),
  optimizeTripRouteUseCase,
  rejectAssignmentRequestUseCase: vi.fn(),
  updateTripStatusUseCase: vi.fn(),
}));

describe("useOptimizeTripRoute", () => {
  beforeEach(() => {
    optimizeTripRouteUseCase.mockReset();
  });

  it("invalidates trip detail and list queries after backend route optimization", async () => {
    optimizeTripRouteUseCase.mockResolvedValue({
      fallbackUsed: false,
      provider: "OSRM",
      stops: [
        {
          actualArrivalTime: null,
          expectedArrivalTime: null,
          hubId: null,
          id: 102,
          orderId: 2,
          stopSequence: 1,
          stopType: "DROPOFF",
        },
      ],
      totalDistance: 12.5,
      totalDuration: 1800,
      tripId: 15,
    });

    const { queryClient, result } = renderHookWithProviders(() =>
      useOptimizeTripRoute(),
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await act(async () => {
      await result.current.mutateAsync("15");
    });

    expect(optimizeTripRouteUseCase).toHaveBeenCalledWith("15");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["trips", "detail", "15"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["trips", "list"],
    });
  });
});
