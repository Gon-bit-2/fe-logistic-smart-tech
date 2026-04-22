import type {
  PaymentApiDto,
  PaymentMethodCode,
  PaymentRecordDto,
  PaymentStatus,
} from "@/features/payments/domain/types/payment.types";

function normalizePaymentStatus(
  value?: string | null,
): PaymentStatus | string | null {
  switch (value) {
    case "COMPLETED":
    case "FAILED":
    case "PENDING":
    case "REFUNDED":
      return value;
    default:
      return value ?? null;
  }
}

function normalizePaymentMethod(
  value?: string | null,
): PaymentMethodCode | string | null {
  switch (value) {
    case "COD":
    case "STRIPE":
      return value;
    default:
      return value ?? null;
  }
}

export function mapPaymentApiToRecord(
  payload?: PaymentApiDto | null,
): PaymentRecordDto | null {
  if (!payload) {
    return null;
  }

  return {
    amount: payload.amount != null ? Number(payload.amount) : null,
    method: normalizePaymentMethod(payload.method),
    orderId: payload.orderId != null ? String(payload.orderId) : null,
    paidAt: payload.paidAt ?? null,
    status: normalizePaymentStatus(payload.status),
    transactionId: payload.transactionId ?? null,
  };
}
