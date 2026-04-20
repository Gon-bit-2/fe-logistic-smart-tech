const PAYMENT_STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Đã thanh toán",
  FAILED: "Thanh toán chưa thành công",
  PENDING: "Chờ thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

export function getPaymentStatusLabel(status?: string | null) {
  if (!status) {
    return "Chưa có thanh toán";
  }

  return PAYMENT_STATUS_LABELS[status] ?? status;
}
