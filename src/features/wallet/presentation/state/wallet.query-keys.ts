export const walletKeys = {
  all: ["wallet"] as const,
  driver: (driverId?: string | number) =>
    [...walletKeys.all, "driver", driverId ?? "unknown"] as const,
  me: () => [...walletKeys.all, "me"] as const,
  reconciliation: () => [...walletKeys.all, "reconciliation"] as const,
};
