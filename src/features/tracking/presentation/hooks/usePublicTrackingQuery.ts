"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { TrackingDetailViewModel } from "@/features/tracking/domain/types/tracking.types";
import { getPublicTrackingUseCase } from "@/features/tracking/application/use-cases/tracking.use-cases";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";
import type { Locale } from "@/i18n/config";

export function usePublicTrackingQuery(trackingCode: string) {
  const locale = useLocale() as Locale;

  return useQuery<TrackingDetailViewModel, ApiError>({
    enabled: trackingCode.trim().length > 0,
    queryFn: () => getPublicTrackingUseCase(trackingCode, locale),
    queryKey: [...trackingKeys.publicDetail(trackingCode), locale],
  });
}
