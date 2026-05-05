import type {
  WalletMutationResult,
  WalletRecord,
  WalletRecordDto,
} from "@/features/wallet/domain/types/wallet.types";

function toAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

export function mapWalletRecord(dto: WalletRecordDto): WalletRecord {
  return {
    balance: toAmount(dto.balance),
    codCollected: toAmount(dto.codCollected),
    createdAt: dto.createdAt ?? null,
    id: String(dto.id),
    status: dto.status ?? "ACTIVE",
    updatedAt: dto.updatedAt ?? null,
    userId: String(dto.userId),
  };
}

export function mapWalletMutationResult(
  dto: WalletRecordDto | WalletMutationResult,
): WalletMutationResult {
  if ("id" in dto && "userId" in dto) {
    return mapWalletRecord(dto);
  }

  return dto;
}
