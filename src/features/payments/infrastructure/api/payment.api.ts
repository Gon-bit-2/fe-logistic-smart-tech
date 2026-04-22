import { httpClient } from "@/lib/api/http-client";
import type {
  PaymentApiDto,
  CodConfirmResponse,
  PaymentIntentResponse,
  PaymentRecordDto,
} from "@/features/payments/domain/types/payment.types";
import { mapPaymentApiToRecord } from "@/features/payments/application/mappers/payment.mapper";
import {
  API_PAYMENT_COD_CONFIRM,
  API_PAYMENT_CREATE_INTENT,
  API_PAYMENT_ORDER,
} from "@/utils/apiUrl";

const PAYMENT_INTENT_TIMEOUT_MS = 15000;

export async function createPaymentIntentRequest(orderId: string) {
  const response = await httpClient.post<PaymentIntentResponse>(
    API_PAYMENT_CREATE_INTENT(orderId),
    undefined,
    {
      timeout: PAYMENT_INTENT_TIMEOUT_MS,
    },
  );
  return response.data;
}

export async function getPaymentByOrderRequest(orderId: string) {
  const response = await httpClient.get<PaymentApiDto | null>(
    API_PAYMENT_ORDER(orderId),
  );
  return mapPaymentApiToRecord(response.data);
}

export async function confirmCodPaymentRequest(orderId: string) {
  const response = await httpClient.post<CodConfirmResponse>(
    API_PAYMENT_COD_CONFIRM(orderId),
  );
  return response.data;
}
