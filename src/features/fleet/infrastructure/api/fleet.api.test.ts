import { beforeEach, describe, expect, it, vi } from "vitest";
import { listFleetVehiclesRequest } from "@/features/fleet/infrastructure/api/fleet.api";
import { httpClient } from "@/lib/api/http-client";

vi.mock("@/lib/api/http-client", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const get = vi.mocked(httpClient.get);

describe("fleet.api", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("requests the full vehicle list without client-side type fan-out", async () => {
    get.mockResolvedValue({
      data: {
        data: [
          { id: 1, licensePlate: "EV-1", type: "ELECTRIC_VAN" },
          { id: 2, licensePlate: "MC-1", type: "MOTORCYCLE" },
        ],
        totalItems: 2,
      },
    });

    const result = await listFleetVehiclesRequest();

    expect(result.totalItems).toBe(2);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/vehicles", {
      params: {
        limit: 100,
        page: 1,
      },
    });
  });
});
