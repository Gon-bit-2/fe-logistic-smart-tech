import { beforeEach, describe, expect, it, vi } from "vitest";

describe("warehouse.use-cases", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("throws when the API base URL is missing", async () => {
    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: false,
    }));
    vi.doMock("@/features/warehouses/infrastructure/api/warehouse.api", () => ({
      listHubsRequest: vi.fn(),
    }));

    const { listHubsUseCase } = await import("./warehouse.use-cases");

    await expect(listHubsUseCase()).rejects.toThrow("API chưa được cấu hình.");
  });

  it("returns the backend hub list when the API is configured", async () => {
    const listHubsRequest = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: "Tan Binh Hub" }],
      totalItems: 1,
    });

    vi.doMock("@/lib/api/env", () => ({
      hasApiBaseUrl: true,
    }));
    vi.doMock("@/features/warehouses/infrastructure/api/warehouse.api", () => ({
      listHubsRequest,
    }));

    const { listHubsUseCase } = await import("./warehouse.use-cases");

    await expect(listHubsUseCase()).resolves.toEqual({
      data: [{ id: 1, name: "Tan Binh Hub" }],
      totalItems: 1,
    });
    expect(listHubsRequest).toHaveBeenCalledTimes(1);
  });
});
