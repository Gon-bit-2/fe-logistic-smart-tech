export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentMethodCode = "STRIPE" | "COD";

export type PaymentIntentResponse = {
  amount: number;
  clientSecret: string;
  transactionId: string;
};

export type PaymentApiDto = {
  amount?: number | string | null;
  method?: PaymentMethodCode | string | null;
  orderId?: number | string | null;
  paidAt?: string | null;
  status?: PaymentStatus | string | null;
  transactionId?: string | null;
};

export type PaymentRecordDto = {
  amount?: number | null;
  method?: PaymentMethodCode | string | null;
  orderId?: string | null;
  paidAt?: string | null;
  status?: PaymentStatus | string | null;
  transactionId?: string | null;
};

export type CodConfirmResponse = {
  message: string;
  success: boolean;
};
