"use client";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import DriverPage from "./page";

const useTripsQueryMock = vi.fn();
const useDriverDispatchBoardQueryMock = vi.fn();
const useTripDetailQueryMock = vi.fn();
const useCreateDriverAssignmentRequestMock = vi.fn();
const useUpdateTripStatusMock = vi.fn();

vi.mock("@/features/trips/presentation/hooks/useTrips", () => ({
  useCreateDriverAssignmentRequest: () => useCreateDriverAssignmentRequestMock(),
  useDriverDispatchBoardQuery: () => useDriverDispatchBoardQueryMock(),
  useTripDetailQuery: (...args: unknown[]) => useTripDetailQueryMock(...args),
  useTripsQuery: (...args: unknown[]) => useTripsQueryMock(...args),
  useUpdateTripStatus: () => useUpdateTripStatusMock(),
}));

describe("DriverPage", () => {
  const createRequestMutateAsyncMock = vi.fn().mockResolvedValue({
    id: 501,
    status: "PENDING",
  });

  beforeEach(() => {
    createRequestMutateAsyncMock.mockClear();

    useTripsQueryMock.mockReturnValue({
      data: {
        data: [
          {
            driverName: "Tran Van B",
            id: "88",
            orderCount: 2,
            orders: [],
            status: "PENDING",
            stops: [],
            vehicleLicensePlate: "51A-88888",
          },
          {
            driverName: "Tran Van B",
            id: "89",
            orderCount: 1,
            orders: [],
            status: "COMPLETED",
            stops: [],
            vehicleLicensePlate: "51A-99999",
          },
        ],
      },
      isPending: false,
      refetch: vi.fn(),
    });
    useDriverDispatchBoardQueryMock.mockReturnValue({
      data: {
        activeTrip: {
          id: 88,
          status: "PENDING",
          vehicleId: 21,
          vehicleLicensePlate: "51A-88888",
        },
        assignableOrders: [
          {
            id: 101,
            preferredDeliveryTimeEnd: "2026-04-25T10:00:00.000Z",
            receiverAddress: "Quận 10, Hồ Chí Minh",
            receiverName: "Lan",
            receiverPhone: "0900000001",
            request: null,
            senderAddress: "Quận 7, Hồ Chí Minh",
            status: "PENDING",
            totalVolume: 1.2,
            totalWeight: 12,
            trackingCode: "ORD-101",
          },
        ],
        hubId: 7,
        requests: [
          {
            createdAt: "2026-04-25T09:00:00.000Z",
            driverId: 12,
            driverName: "Tran Van B",
            hubId: 7,
            id: 301,
            orderId: 98,
            orderTrackingCode: "ORD-098",
            reviewNote: null,
            reviewedAt: null,
            reviewedById: null,
            status: "PENDING",
            trip: null,
          },
        ],
        summary: {
          activeTripCount: 1,
          assignableOrderCount: 1,
          completedTripCount: 1,
          inProgressTripCount: 0,
          pendingRequestCount: 1,
        },
      },
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
    useTripDetailQueryMock.mockReturnValue({
      data: {
        driverName: "Tran Van B",
        id: "88",
        orderCount: 2,
        orders: [],
        status: "PENDING",
        stops: [
          {
            id: "1",
            order: {
              id: "101",
              receiverAddress: "Quận 10, Hồ Chí Minh",
              receiverName: "Lan",
              receiverPhone: "0900000001",
              reference: "ORD-101",
              status: "ASSIGNED",
              trackingCode: "ORD-101",
            },
            orderId: "101",
            stopSequence: 1,
            stopType: "DROPOFF",
          },
        ],
        vehicleLicensePlate: "51A-88888",
      },
      refetch: vi.fn(),
    });
    useCreateDriverAssignmentRequestMock.mockReturnValue({
      isPending: false,
      mutateAsync: createRequestMutateAsyncMock,
      variables: undefined,
    });
    useUpdateTripStatusMock.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    });
  });

  it("renders request queue and submits a driver assignment request", async () => {
    renderWithProviders(<DriverPage />);

    expect(screen.getByText("Request của tôi")).toBeInTheDocument();
    expect(screen.getByText("ORD-098")).toBeInTheDocument();
    expect(screen.getAllByText("ORD-101").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Gửi yêu cầu nhận đơn/i }));

    await waitFor(() =>
      expect(createRequestMutateAsyncMock).toHaveBeenCalledWith({ orderId: 101 }),
    );
  });
});
