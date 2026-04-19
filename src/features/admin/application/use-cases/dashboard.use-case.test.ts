import { describe, expect, it } from "vitest";
import { computeDispatcherMetrics } from "./dashboard.use-case";

describe("computeDispatcherMetrics", () => {
  it("counts only active orders and available vehicles", () => {
    expect(
      computeDispatcherMetrics(
        [
          { status: "PENDING" },
          { status: "IN_TRANSIT" },
          { status: "DELIVERED" },
          { status: "CANCELLED" },
        ],
        [
          { isActive: true, fuelType: "DIESEL", type: "TRUCK" },
          { isActive: false, fuelType: "ELECTRIC", type: "ELECTRIC_VAN" },
          { fuelType: "ELECTRIC", type: "VAN" },
        ],
      ),
    ).toEqual({
      activeOrders: 2,
      availableVehicles: 2,
      electricVehicles: 2,
    });
  });
});
