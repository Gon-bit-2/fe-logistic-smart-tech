"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import { clearAuthSession, getAuthSessionSnapshot } from "@/features/auth/presentation/state/auth.store";

export function useLogoutMutation() {
  return useMutation<Awaited<ReturnType<typeof logout>> | null, ApiError>({
    mutationFn: async () => {
      const { refreshToken } = getAuthSessionSnapshot();

      if (!refreshToken) {
        return null;
      }

      try {
        return await logout(refreshToken);
      } finally {
        clearAuthSession();
      }
    },
  });
}

