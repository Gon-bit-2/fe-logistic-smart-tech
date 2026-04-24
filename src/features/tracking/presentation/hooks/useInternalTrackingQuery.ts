"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { TrackingDetailViewModel } from "@/features/tracking/domain/types/tracking.types";
import { getInternalTrackingUseCase } from "@/features/tracking/application/use-cases/tracking.use-cases";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";
import type { Locale } from "@/i18n/config";

export function useInternalTrackingQuery(orderId: string, enabled = true) {
  const locale = useLocale() as Locale;

  return useQuery<TrackingDetailViewModel, ApiError>({
    enabled: enabled && orderId.trim().length > 0,
    queryFn: () => getInternalTrackingUseCase(orderId, locale),
    queryKey: [...trackingKeys.internalTimeline(orderId), locale],
  });
}
