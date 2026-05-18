import { useTranslations } from "next-intl";
import { isApiError, normalizeApiError } from "@/lib/api/errors";

type Translator = ReturnType<typeof useTranslations>;

function hasMessage(t: Translator, key: string) {
  return t.has(key as never);
}

function translateIfExists(t: Translator, key: string) {
  return hasMessage(t, key) ? t(key as never) : null;
}

function errorCodeToMessageKey(errorCode: string) {
  return `codes.${errorCode}`;
}

export function getLocalizedApiErrorMessage(
  error: unknown,
  t: Translator,
): string {
  const apiError = normalizeApiError(error);

  if (apiError.errorCode) {
    const byCode = translateIfExists(t, errorCodeToMessageKey(apiError.errorCode));

    if (byCode) {
      return byCode;
    }
  }

  if (isApiError(apiError) && apiError.status) {
    const byStatus = translateIfExists(t, `status.${apiError.status}`);

    if (byStatus) {
      return byStatus;
    }
  }

  return apiError.message || t("fallback");
}

export function useLocalizedApiErrorMessage() {
  const t = useTranslations("errors.api");

  return (error: unknown) => getLocalizedApiErrorMessage(error, t);
}
