"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import { clearAuthSession, getAuthSessionSnapshot } from "@/store/useAuthStore";

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
