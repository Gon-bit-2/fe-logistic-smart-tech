import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import TripsManagementScreen from "./TripsManagementScreen";

const useHubsQueryMock = vi.fn();
const useDispatchBoardQueryMock = vi.fn();
const useTripsQueryMock = vi.fn();
const useUpdateTripStatusMock = vi.fn();
const useDispatchPreviewMock = vi.fn();
const useManualCreateTripMock = vi.fn();
const useAssignVehicleToTripMock = vi.fn();
const useAddOrdersToTripMock = vi.fn();
const useAssignmentRequestInboxQueryMock = vi.fn();
const useApproveAssignmentRequestMock = vi.fn();
const useRejectAssignmentRequestMock = vi.fn();

vi.mock("@/features/warehouses/presentation/hooks/useHubsQuery", () => ({
  useHubsQuery: () => useHubsQueryMock(),
}));

vi.mock("@/features/trips/presentation/hooks/useTrips", () => ({
  useAddOrdersToTrip: () => useAddOrdersToTripMock(),
  useApproveAssignmentRequest: () => useApproveAssignmentRequestMock(),
  useAssignVehicleToTrip: () => useAssignVehicleToTripMock(),
  useAssignmentRequestInboxQuery: () => useAssignmentRequestInboxQueryMock(),
  useRejectAssignmentRequest: () => useRejectAssignmentRequestMock(),
  useDispatchBoardQuery: (...args: unknown[]) => useDispatchBoardQueryMock(...args),
  useDispatchPreview: () => useDispatchPreviewMock(),
  useManualCreateTrip: () => useManualCreateTripMock(),
  useTripsQuery: (...args: unknown[]) => useTripsQueryMock(...args),
  useUpdateTripStatus: () => useUpdateTripStatusMock(),
}));

describe("TripsManagementScreen", () => {
  const boardRefetchMock = vi.fn().mockResolvedValue(undefined);
  const tripsRefetchMock = vi.fn().mockResolvedValue(undefined);
  const createTripMutateAsyncMock = vi.fn().mockResolvedValue({
    success: true,
  });
  const assignTripMutateAsyncMock = vi.fn().mockResolvedValue({
    success: true,
  });
  const addOrdersMutateAsyncMock = vi.fn().mockResolvedValue({
    success: true,
  });
  const approveRequestMutateAsyncMock = vi.fn().mockResolvedValue({
    id: 501,
    status: "APPROVED",
  });
  const rejectRequestMutateAsyncMock = vi.fn().mockResolvedValue({
    id: 501,
    status: "REJECTED",
  });

  beforeEach(() => {
    boardRefetchMock.mockClear();
    tripsRefetchMock.mockClear();
    createTripMutateAsyncMock.mockClear();
    assignTripMutateAsyncMock.mockClear();
    addOrdersMutateAsyncMock.mockClear();
    approveRequestMutateAsyncMock.mockClear();
    rejectRequestMutateAsyncMock.mockClear();

    useHubsQueryMock.mockReturnValue({
      data: { data: [] },
    });
    useDispatchBoardQueryMock.mockReturnValue({
      data: {
        dispatchableOrders: [
          {
            id: 101,
            receiverAddress: "Quận 10, Hồ Chí Minh",
            receiverName: "Lan",
            senderAddress: "Quận 7, Hồ Chí Minh",
            status: "PENDING",
            totalVolume: 1.2,
            totalWeight: 12,
            trackingCode: "ORD-101",
          },
        ],
        drivers: [
          {
            fullName: "Nguyen Van A",
            id: 11,
            isAvailable: true,
            phone: "0900000001",
          },
          {
            activeTripId: 88,
            activeTripStatus: "PENDING",
            fullName: "Tran Van B",
            id: 12,
            isAvailable: false,
            phone: "0900000002",
          },
        ],
        hubId: 7,
        pendingTrips: [
          {
            driverId: 12,
            driverName: "Tran Van B",
            id: 88,
            orderCount: 1,
            orderIds: [202],
            orders: [],
            remainingVolume: 4,
            remainingWeight: 40,
            status: "PENDING",
            totalAssignedVolume: 2,
            totalAssignedWeight: 20,
            vehicleId: 21,
            vehicleLicensePlate: "51A-88888",
          },
        ],
        summary: {
          availableDriverCount: 1,
          availableVehicleCount: 1,
          dispatchableOrderCount: 1,
          dispatchableVolume: 1.2,
          dispatchableWeight: 12,
          pendingTripCount: 1,
        },
        vehicles: [
          {
            capacityVolume: 6,
            capacityWeight: 80,
            id: 21,
            isAvailable: true,
            licensePlate: "51A-88888",
            type: "TRUCK",
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      refetch: boardRefetchMock,
    });
    useTripsQueryMock.mockReturnValue({
      data: {
        data: [
          {
            driverName: "Tran Van B",
            id: "88",
            orderCount: 1,
            orders: [],
            status: "PENDING",
            vehicleLicensePlate: "51A-88888",
          },
        ],
      },
      isPending: false,
      refetch: tripsRefetchMock,
    });
    useUpdateTripStatusMock.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    });
    useDispatchPreviewMock.mockReturnValue({
      data: {
        hubId: 7,
        suggestions: [
          {
            driverId: 11,
            driverName: "Nguyen Van A",
            hubId: 7,
            orderIds: [101],
            totalVolume: 1.2,
            totalWeight: 12,
            vehicleId: 21,
            vehicleLicensePlate: "51A-88888",
          },
        ],
      },
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
    useManualCreateTripMock.mockReturnValue({
      isPending: false,
      mutateAsync: createTripMutateAsyncMock,
    });
    useAssignVehicleToTripMock.mockReturnValue({
      isPending: false,
      mutateAsync: assignTripMutateAsyncMock,
    });
    useAddOrdersToTripMock.mockReturnValue({
      isPending: false,
      mutateAsync: addOrdersMutateAsyncMock,
    });
    useAssignmentRequestInboxQueryMock.mockReturnValue({
      data: {
        data: [
          {
            createdAt: "2026-04-25T09:00:00.000Z",
            driverId: 12,
            driverName: "Tran Van B",
            hubId: 7,
            id: 501,
            order: {
              id: 101,
              receiverAddress: "Quận 10, Hồ Chí Minh",
              receiverName: "Lan",
              senderAddress: "Quận 7, Hồ Chí Minh",
              status: "PENDING",
              totalVolume: 1.2,
              totalWeight: 12,
              trackingCode: "ORD-101",
            },
            orderId: 101,
            orderTrackingCode: "ORD-101",
            pendingTripsForDriver: [
              {
                id: 88,
                status: "PENDING",
                vehicleId: 21,
                vehicleLicensePlate: "51A-88888",
              },
            ],
            status: "PENDING",
            trip: null,
          },
        ],
        totalItems: 1,
      },
      error: null,
      isError: false,
      isPending: false,
    });
    useApproveAssignmentRequestMock.mockReturnValue({
      isPending: false,
      mutateAsync: approveRequestMutateAsyncMock,
    });
    useRejectAssignmentRequestMock.mockReturnValue({
      isPending: false,
      mutateAsync: rejectRequestMutateAsyncMock,
    });
  });

  it("renders Vietnamese dispatch statuses and creates a manual trip", async () => {
    renderWithProviders(<TripsManagementScreen scope="warehouse" />);

    expect(screen.getAllByText("Chờ xác nhận").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /ORD-101/i }));
    fireEvent.change(screen.getByLabelText("Tài xế"), {
      target: { value: "11" },
    });
    fireEvent.change(screen.getByLabelText("Xe"), {
      target: { value: "21" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Tạo chuyến thủ công" }));

    await waitFor(() =>
      expect(createTripMutateAsyncMock).toHaveBeenCalledWith({
        driverId: 11,
        hubId: 7,
        orderIds: [101],
        vehicleId: 21,
      }),
    );
  });

  it("can add selected orders into an existing pending trip", async () => {
    renderWithProviders(<TripsManagementScreen scope="warehouse" />);

    fireEvent.click(screen.getByRole("button", { name: /Thêm vào chuyến chờ/i }));
    fireEvent.change(screen.getByLabelText("Chuyến chờ"), {
      target: { value: "88" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ORD-101/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("Tài xế")).toHaveValue("12");
      expect(screen.getByLabelText("Xe")).toHaveValue("21");
    });

    fireEvent.click(screen.getByRole("button", { name: "Thêm đơn vào chuyến chờ" }));

    await waitFor(() =>
      expect(assignTripMutateAsyncMock).toHaveBeenCalledWith({
        payload: {
          driverId: 12,
          vehicleId: 21,
        },
        tripId: 88,
      }),
    );
    await waitFor(() =>
      expect(addOrdersMutateAsyncMock).toHaveBeenCalledWith({
        payload: {
          orderIds: [101],
        },
        tripId: 88,
      }),
    );
  });

  it("approves a driver assignment request into the only pending trip of that driver", async () => {
    renderWithProviders(<TripsManagementScreen scope="warehouse" />);

    fireEvent.click(screen.getByRole("button", { name: /Duyệt và phân đơn/i }));

    await waitFor(() =>
      expect(approveRequestMutateAsyncMock).toHaveBeenCalledWith({
        payload: {},
        requestId: 501,
      }),
    );
  });
});
