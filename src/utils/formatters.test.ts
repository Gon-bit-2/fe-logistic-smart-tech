import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatters";

describe("formatCurrency", () => {
  it("formats VND without decimal places", () => {
    expect(formatCurrency(26089.8, "VND")).toMatch(/26\.090/);
    expect(formatCurrency(26089.8, "VND")).not.toContain(",8");
  });

  it("keeps standard USD decimals", () => {
    expect(formatCurrency(500, "USD")).toContain("500,00");
  });
});
