export const walletScreenCopy = {
  actions: {
    openTrips: "Open trips",
    openVehicle: "View vehicle",
    reconcile: "Reconcile COD",
    refresh: "Refresh",
    retry: "Retry",
  },
  driver: {
    codDescription:
      "Held COD is updated when a driver confirms cash collection for a COD order. Warehouse or admin users reconcile this after cash handoff.",
    codTitle: "Track held COD",
    description:
      "Review wallet balance, unreconciled COD, and jump into the related trip workflows.",
    errorTitle: "Could not load driver wallet",
    eyebrow: "Driver wallet",
    lastUpdated: "Last updated",
    loadingDescription: "Syncing wallet and COD balances...",
    loadingTitle: "Loading driver wallet",
    title: "Driver wallet & COD",
  },
  fields: {
    amount: "COD amount",
    description: "Reconciliation note",
    driverId: "Driver ID",
    referenceId: "Receipt reference",
  },
  metrics: {
    balance: "Wallet balance",
    codCollected: "Held COD",
    status: "Wallet status",
  },
  reconciliation: {
    description:
      "Record COD cash handed off by a driver to warehouse or finance. The transaction reduces the driver's held COD balance.",
    eyebrow: "COD reconciliation",
    previewDescription:
      "Check the amount and receipt reference before confirming. The backend rejects amounts above the driver's held COD balance.",
    previewEyebrow: "Reconciliation amount",
    successMessage: "COD reconciliation recorded successfully.",
    title: "COD reconciliation",
  },
} as const;
