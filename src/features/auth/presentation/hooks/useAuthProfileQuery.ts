"use client";

import { useQuery } from "@tanstack/react-query";
import { toAuthProfile } from "@/features/auth/application/services/auth-session";
import type { AuthProfile } from "@/features/auth/domain/types/auth.types";
import { getProfile } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";

export const authProfileQueryKey = ["auth", "profile"] as const;

export function useAuthProfileQuery(enabled = true) {
  return useQuery<AuthProfile, ApiError>({
    enabled,
    queryFn: async () => toAuthProfile(await getProfile()),
    queryKey: authProfileQueryKey,
    staleTime: 5 * 60_000,
  });
}
