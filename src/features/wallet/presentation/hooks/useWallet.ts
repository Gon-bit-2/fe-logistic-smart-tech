"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyWalletUseCase,
  reconcileCodUseCase,
} from "@/features/wallet/application/use-cases/wallet.use-cases";
import type {
  ReconcileCodInput,
  WalletMutationResult,
  WalletRecord,
} from "@/features/wallet/domain/types/wallet.types";
import { walletKeys } from "@/features/wallet/presentation/state/wallet.query-keys";
import { orderKeys } from "@/features/orders/presentation/state/order.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useMyWalletQuery(enabled = true) {
  return useQuery<WalletRecord, ApiError>({
    enabled,
    queryFn: getMyWalletUseCase,
    queryKey: walletKeys.me(),
    staleTime: 60_000,
  });
}

export function useReconcileCod() {
  const queryClient = useQueryClient();

  return useMutation<WalletMutationResult, ApiError, ReconcileCodInput>({
    mutationFn: reconcileCodUseCase,
    mutationKey: walletKeys.reconciliation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
