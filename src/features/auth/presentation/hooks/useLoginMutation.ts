"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import { setAuthSessionTokens } from "@/features/auth/presentation/state/auth.store";
import type { AuthLoginInput } from "@/features/auth/domain/types/auth.types";
import type { SessionTokens } from "@/types/common.type";

export function useLoginMutation() {
  return useMutation<SessionTokens, ApiError, AuthLoginInput>({
    mutationFn: login,
    onSuccess: (tokens) => {
      setAuthSessionTokens(tokens);
    },
  });
}

