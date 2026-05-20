"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import {
  clearOtpFlowState,
  getAuthSessionSnapshot,
} from "@/features/auth/presentation/state/auth.store";
import { useTranslations } from "next-intl";

type ForgotPasswordMutationInput = {
  code: string;
};

export function useForgotPasswordMutation() {
  const tAuthRuntime = useTranslations("auth.runtime");

  return useMutation<unknown, ApiError, ForgotPasswordMutationInput>({
    mutationFn: async ({ code }: ForgotPasswordMutationInput) => {
      const { pendingPasswordReset } = getAuthSessionSnapshot();

      if (!pendingPasswordReset) {
        throw new ApiError({
          message: tAuthRuntime("missingForgotPasswordSession"),
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
