import { describe, expect, it } from "vitest";
import { mapPaymentApiToRecord } from "./payment.mapper";

describe("mapPaymentApiToRecord", () => {
  it("returns null for empty payment payloads", () => {
    expect(mapPaymentApiToRecord(null)).toBeNull();
    expect(mapPaymentApiToRecord(undefined)).toBeNull();
  });

  it("maps nullable backend fields to safe record defaults", () => {
    expect(
      mapPaymentApiToRecord({
        amount: null,
        method: null,
        orderId: undefined,
        paidAt: undefined,
        status: null,
        transactionId: undefined,
      }),
    ).toEqual({
      amount: null,
      method: null,
      orderId: null,
      paidAt: null,
      status: null,
      transactionId: null,
    });
  });

  it.each(["COMPLETED", "FAILED", "PENDING"] as const)(
    "preserves the %s payment status",
    (status) => {
      expect(
        mapPaymentApiToRecord({
          amount: "125000",
          method: "STRIPE",
          orderId: 42,
          paidAt: "2026-04-21T10:30:00.000Z",
          status,
          transactionId: "pi_42",
        }),
      ).toMatchObject({
        amount: 125000,
        method: "STRIPE",
        orderId: "42",
        paidAt: "2026-04-21T10:30:00.000Z",
        status,
        transactionId: "pi_42",
      });
    },
  );
});
