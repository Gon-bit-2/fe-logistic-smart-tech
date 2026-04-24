"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import {
  clearOtpFlowState,
  getAuthSessionSnapshot,
} from "@/features/auth/presentation/state/auth.store";
import { useI18nCopy } from "@/i18n/useCopy";

type ForgotPasswordMutationInput = {
  code: string;
};

export function useForgotPasswordMutation() {
  const { authRuntimeCopy } = useI18nCopy();

  return useMutation<unknown, ApiError, ForgotPasswordMutationInput>({
    mutationFn: async ({ code }: ForgotPasswordMutationInput) => {
      const { pendingPasswordReset } = getAuthSessionSnapshot();

      if (!pendingPasswordReset) {
        throw new ApiError({
          message: authRuntimeCopy.missingForgotPasswordSession,
        });
      }

      return forgotPassword({
        ...pendingPasswordReset,
        code,
      });
    },
    onSuccess: () => {
      clearOtpFlowState();
    },
  });
}
