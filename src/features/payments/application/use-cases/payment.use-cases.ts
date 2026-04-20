import { hasApiBaseUrl } from "@/lib/api/env";
import {
  confirmCodPaymentRequest,
  createPaymentIntentRequest,
  getPaymentByOrderRequest,
} from "@/features/payments/infrastructure/api/payment.api";
import { ApiError } from "@/lib/api/errors";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message: "Payments API chưa được cấu hình.",
      status: 503,
    });
  }
}

export async function createPaymentIntentUseCase(orderId: string) {
  assertApiConfigured();
  return createPaymentIntentRequest(orderId);
}

export async function getPaymentByOrderUseCase(orderId: string) {
  assertApiConfigured();
  return getPaymentByOrderRequest(orderId);
}

export async function confirmCodPaymentUseCase(orderId: string) {
  assertApiConfigured();
  return confirmCodPaymentRequest(orderId);
}
