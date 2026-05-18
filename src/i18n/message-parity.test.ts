import { describe, expect, it } from "vitest";
import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";

type MessageTree = Record<string, unknown>;

function isRecord(value: unknown): value is MessageTree {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function collectShape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return [path];
  }

  if (!isRecord(value)) {
    return [path];
  }

  return Object.keys(value)
    .sort()
    .flatMap((key) => collectShape(value[key], path ? `${path}.${key}` : key));
}

describe("i18n messages", () => {
  it("keeps English and Vietnamese message shapes in sync", () => {
    expect(collectShape(enMessages)).toEqual(collectShape(viMessages));
  });
});
