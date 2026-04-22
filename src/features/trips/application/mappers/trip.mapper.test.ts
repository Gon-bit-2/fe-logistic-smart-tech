import { describe, expect, it } from "vitest";
import { mapTripApiToViewModel } from "./trip.mapper";

describe("mapTripApiToViewModel", () => {
  it("maps nested driver, vehicle and stop orders from the backend shape", () => {
    const trip = mapTripApiToViewModel({
      actualDistance: 18.5,
      currentHubId: 4,
      driver: {
        avatar: "https://example.com/driver.jpg",
        fullName: "Nguyen Van Driver",
        id: 12,
      },
      id: 88,
      startTime: "2026-04-22T08:00:00.000Z",
      status: "IN_PROGRESS",
      stops: [
        {
          id: 1,
          order: {
            id: 101,
            status: "ASSIGNED",
            trackingCode: "GT-ORD-20260003",
          },
          orderId: 101,
          stopSequence: 1,
          stopType: "DROPOFF",
        },
        {
          id: 2,
          order: {
            id: 101,
            status: "ASSIGNED",
            trackingCode: "GT-ORD-20260003",
          },
          orderId: 101,
          stopSequence: 2,
          stopType: "DROPOFF",
        },
      ],
      vehicle: {
        capacityVolume: 22,
        capacityWeight: 1500,
        emissionRatePerKm: 0,
        fuelType: "ELECTRIC",
        hubId: 7,
        id: 9,
        isActive: true,
        licensePlate: "51D-888.88",
        type: "ELECTRIC_VAN",
      },
      vehicleId: 9,
    });

    expect(trip.status).toBe("IN_PROGRESS");
    expect(trip.driverName).toBe("Nguyen Van Driver");
    expect(trip.driverAvatarUrl).toBe("https://example.com/driver.jpg");
    expect(trip.vehicleLicensePlate).toBe("51D-888.88");
    expect(trip.vehicle?.fuelType).toBe("ELECTRIC");
    expect(trip.orderCount).toBe(1);
    expect(trip.orders).toEqual([
      {
        orderId: "101",
        reference: "GT-ORD-20260003",
        status: "ASSIGNED",
        trackingCode: "GT-ORD-20260003",
      },
    ]);
    expect(trip.totalDistance).toBe(18.5);
  });
});
