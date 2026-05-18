import { useTranslations } from "next-intl";

function translateEnum(
  t: ReturnType<typeof useTranslations>,
  namespace: string,
  value?: string | null,
) {
  if (!value) {
    return "";
  }

  const key = `${namespace}.${value}`;
  return t.has(key as never) ? t(key as never) : value;
}

export function useOrderLabels() {
  const t = useTranslations("orders");

  return {
    getOrderStatusLabel(value?: string | null) {
      return translateEnum(t, "status", value);
    },
    getOrderStopStatusLabel(value?: string | null) {
      return translateEnum(t, "stopStatus", value);
    },
  };
}
