import { describe, expect, it } from "vitest";
import { localizePath, stripLocale } from "@/i18n/config";

describe("i18n path helpers", () => {
  it("strips supported locale prefixes", () => {
    expect(stripLocale("/en")).toBe("/");
    expect(stripLocale("/en/orders")).toBe("/orders");
    expect(stripLocale("/vi/tracking/ELG-1")).toBe("/tracking/ELG-1");
  });

  it("does not duplicate locale prefixes when localizing paths", () => {
    expect(localizePath("/en", "en")).toBe("/en");
    expect(localizePath("/en/orders", "vi")).toBe("/vi/orders");
    expect(localizePath("/orders", "en")).toBe("/en/orders");
  });
});
