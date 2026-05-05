import {
  getMyWalletRequest,
  reconcileCodRequest,
} from "@/features/wallet/infrastructure/api/wallet.api";
import type { ReconcileCodInput } from "@/features/wallet/domain/types/wallet.types";

export async function getMyWalletUseCase() {
  return getMyWalletRequest();
}

export async function reconcileCodUseCase(input: ReconcileCodInput) {
  return reconcileCodRequest({
    ...input,
    description: input.description?.trim() || undefined,
    referenceId: input.referenceId.trim(),
  });
}
