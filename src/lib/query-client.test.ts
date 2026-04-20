import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { createQueryClient, queryClientConfig, shouldRetryQuery } from "./query-client";

describe("query-client", () => {
  it("uses the configured stale and garbage-collection times", () => {
    const client = createQueryClient();

    expect(client.getDefaultOptions().queries?.staleTime).toBe(queryClientConfig.staleTime);
    expect(client.getDefaultOptions().queries?.gcTime).toBe(queryClientConfig.gcTime);
    expect(client.getDefaultOptions().mutations?.retry).toBe(false);
  });

  it("does not retry after the first failed attempt", () => {
    expect(shouldRetryQuery(1, new Error("boom"))).toBe(false);
  });

  it("retries generic errors and ApiErrors without status", () => {
    expect(shouldRetryQuery(0, new Error("network"))).toBe(true);
    expect(shouldRetryQuery(0, new ApiError({ message: "unknown" }))).toBe(true);
  });

  it("retries only server-side ApiErrors", () => {
    expect(
      shouldRetryQuery(0, new ApiError({ message: "bad request", status: 400 })),
    ).toBe(false);
    expect(
      shouldRetryQuery(0, new ApiError({ message: "server error", status: 503 })),
    ).toBe(true);
  });
});
