const DEFAULT_LOCALE = "vi-VN";
const DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function formatCurrency(
  value: number,
  currency = "USD",
  locale = DEFAULT_LOCALE,
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDate(
  value: Date | number | string,
  locale = DEFAULT_LOCALE,
  timeZone = DEFAULT_TIME_ZONE,
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

export function formatDateOnly(
  value: Date | number | string,
  locale = DEFAULT_LOCALE,
  timeZone = DEFAULT_TIME_ZONE,
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone,
  }).format(new Date(value));
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
