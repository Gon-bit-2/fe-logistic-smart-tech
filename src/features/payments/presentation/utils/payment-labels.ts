import { useTranslations } from "next-intl";

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Đã thanh toán",
  FAILED: "Thanh toán chưa thành công",
  PENDING: "Chờ thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "COD",
  STRIPE: "Stripe",
};

export function getPaymentStatusLabel(status?: string | null) {
  if (!status) {
    return "Chưa có thanh toán";
  }

  return PAYMENT_STATUS_LABELS[status] ?? status;
}

export function getPaymentMethodLabel(method?: string | null) {
  if (!method) {
    return null;
  }

  return PAYMENT_METHOD_LABELS[method] ?? method;
}

export function usePaymentLabels() {
  const t = useTranslations("payments");

  return {
    getPaymentMethodLabel(method?: string | null) {
      if (!method) {
        return null;
      }

      const key = `method.${method}`;
      return t.has(key as never) ? t(key as never) : method;
    },
    getPaymentStatusLabel(status?: string | null) {
      if (!status) {
        return t("status.unknown");
      }

      const key = `status.${status}`;
      return t.has(key as never) ? t(key as never) : status;
    },
  };
}
