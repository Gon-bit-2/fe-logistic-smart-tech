import { httpClient } from "@/lib/api/http-client";
import {
  API_WALLET_MY_WALLET,
  API_WALLET_RECONCILE_COD,
} from "@/utils/apiUrl";
import {
  mapWalletMutationResult,
  mapWalletRecord,
} from "@/features/wallet/application/mappers/wallet.mapper";
import type {
  ReconcileCodInput,
  WalletMutationResult,
  WalletRecord,
  WalletRecordDto,
} from "@/features/wallet/domain/types/wallet.types";

export async function getMyWalletRequest(): Promise<WalletRecord> {
  const response = await httpClient.get<WalletRecordDto>(API_WALLET_MY_WALLET);
  return mapWalletRecord(response.data);
}

export async function reconcileCodRequest(
  payload: ReconcileCodInput,
): Promise<WalletMutationResult> {
  const response = await httpClient.post<WalletRecordDto | WalletMutationResult>(
    API_WALLET_RECONCILE_COD,
    payload,
  );
  return mapWalletMutationResult(response.data);
}
