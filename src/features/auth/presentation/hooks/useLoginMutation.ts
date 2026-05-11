"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import { setAuthSession } from "@/features/auth/presentation/state/auth.store";
import type { AuthLoginInput } from "@/features/auth/domain/types/auth.types";
import type { SessionBootstrapPayload } from "@/types/common.type";

export function useLoginMutation() {
  return useMutation<SessionBootstrapPayload, ApiError, AuthLoginInput>({
    mutationFn: login,
    onSuccess: (session) => {
      setAuthSession(session);
    },
  });
}
