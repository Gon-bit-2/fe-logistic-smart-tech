"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import { clearAuthSession } from "@/features/auth/presentation/state/auth.store";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<Awaited<ReturnType<typeof logout>> | null, ApiError>({
    mutationFn: async () => {
      try {
        return await logout();
      } finally {
        clearAuthSession();
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}
