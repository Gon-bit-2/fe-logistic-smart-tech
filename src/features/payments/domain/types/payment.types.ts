export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type PaymentIntentResponse = {
  amount: number;
  clientSecret: string;
  transactionId: string;
};

export type PaymentRecordDto = {
  amount?: number | null;
  orderId?: number | string | null;
  paymentMethod?: string | null;
  status?: PaymentStatus | string | null;
  transactionId?: string | null;
};

export type CodConfirmResponse = {
  message: string;
  success: boolean;
};
