import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getMyWalletRequest,
  reconcileCodRequest,
} from "@/features/wallet/infrastructure/api/wallet.api";
import { httpClient } from "@/lib/api/http-client";

vi.mock("@/lib/api/http-client", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const get = vi.mocked(httpClient.get);
const post = vi.mocked(httpClient.post);

describe("wallet.api", () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
  });

  it("maps my wallet balances from backend decimal strings", async () => {
    get.mockResolvedValue({
      data: {
        balance: "125000.50",
        codCollected: "78000",
        id: 9,
        status: "ACTIVE",
        userId: 12,
      },
    });

    await expect(getMyWalletRequest()).resolves.toEqual(
      expect.objectContaining({
        balance: 125000.5,
        codCollected: 78000,
        id: "9",
        userId: "12",
      }),
    );
    expect(get).toHaveBeenCalledWith("/wallet/my-wallet");
  });

  it("posts COD reconciliation payloads", async () => {
    post.mockResolvedValue({
      data: {
        balance: "0",
        codCollected: "20000",
        id: 10,
        status: "ACTIVE",
        userId: 44,
      },
    });

    await expect(
      reconcileCodRequest({
        amount: 50000,
        driverId: 44,
        referenceId: "REC-1",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        codCollected: 20000,
        userId: "44",
      }),
    );
    expect(post).toHaveBeenCalledWith("/wallet/reconcile-cod", {
      amount: 50000,
      driverId: 44,
      referenceId: "REC-1",
    });
  });
});
