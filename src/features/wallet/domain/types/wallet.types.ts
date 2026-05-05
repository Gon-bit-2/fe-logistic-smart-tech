export type WalletStatus = "ACTIVE" | "BLOCKED" | string;

export type WalletRecordDto = {
  readonly balance?: number | string | null;
  readonly codCollected?: number | string | null;
  readonly createdAt?: string | null;
  readonly id: number | string;
  readonly status?: WalletStatus | null;
  readonly updatedAt?: string | null;
  readonly userId: number | string;
};

export type WalletRecord = {
  readonly balance: number;
  readonly codCollected: number;
  readonly createdAt?: string | null;
  readonly id: string;
  readonly status: WalletStatus;
  readonly updatedAt?: string | null;
  readonly userId: string;
};

export type ReconcileCodInput = {
  readonly amount: number;
  readonly description?: string;
  readonly driverId: number;
  readonly referenceId: string;
};

export type WalletMutationResult = WalletRecord | {
  readonly message?: string;
  readonly success?: boolean;
};
