import { describe, it, expect } from "vitest";
import {
  mapOrderToManagementRow,
  mapOrdersToManagementRows,
} from "./order-management.mapper";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";

const mockOrder: OrderDTO = {
  id: "ord-123",
  reference: "REF-123",
  customerName: "Alice Smith",
  pickupAddress: "123 Main St, New York",
  deliveryAddress: "456 Market St, Boston",
  status: "PENDING",
  serviceTier: "express",
  estimatedArrival: "2026-04-20T10:00:00Z",
  co2SavedKg: 15.5,
  stops: [],
};

describe("order-management.mapper", () => {
  describe("mapOrderToManagementRow", () => {
    it("should map a complete order to a management row correctly", () => {
      const row = mapOrderToManagementRow(mockOrder);

      expect(row.id).toBe("ord-123");
      expect(row.customer).toBe("Alice Smith");
      expect(row.initials).toBe("AL");
      expect(row.date).toBe("2026-04-20T10:00:00Z");
      expect(row.route).toBe("123 Main St -> 456 Market St");
      expect(row.status).toBe("PENDING");
      expect(row.priority).toBe("High");
    });

    it("should handle missing customer name safely", () => {
      const orderWithoutCustomer: OrderDTO = {
        ...mockOrder,
        customerName: "",
      };

      const row = mapOrderToManagementRow(orderWithoutCustomer);
      expect(row.customer).toBe("");
      expect(row.initials).toBe("NA");
    });

    it("should map service tiers to priorities correctly", () => {
      expect(
        mapOrderToManagementRow({ ...mockOrder, serviceTier: "express" })
          .priority,
      ).toBe("High");
      expect(
        mapOrderToManagementRow({ ...mockOrder, serviceTier: "standard" })
          .priority,
      ).toBe("Medium");
      expect(
        mapOrderToManagementRow({ ...mockOrder, serviceTier: "eco_green" }).priority,
      ).toBe("Eco");
    });
  });

  describe("mapOrdersToManagementRows", () => {
    it("should map an array of orders", () => {
      const mockOrder2: OrderDTO = {
        ...mockOrder,
        id: "ord-456",
        customerName: "Bob Jones",
        serviceTier: "standard",
      };

      const rows = mapOrdersToManagementRows([mockOrder, mockOrder2]);

      expect(rows).toHaveLength(2);
      expect(rows[0].id).toBe("ord-123");
      expect(rows[0].priority).toBe("High");
      expect(rows[1].id).toBe("ord-456");
      expect(rows[1].initials).toBe("BO");
      expect(rows[1].priority).toBe("Medium");
    });

    it("should handle empty arrays", () => {
      expect(mapOrdersToManagementRows([])).toEqual([]);
    });
  });
});
