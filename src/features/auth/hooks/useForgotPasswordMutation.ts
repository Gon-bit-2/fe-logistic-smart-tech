"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import {
  clearOtpFlowState,
  getAuthSessionSnapshot,
} from "@/store/useAuthStore";

type ForgotPasswordMutationInput = {
  code: string;
};

export function useForgotPasswordMutation() {
  return useMutation<unknown, ApiError, ForgotPasswordMutationInput>({
    mutationFn: async ({ code }: ForgotPasswordMutationInput) => {
      const { pendingPasswordReset } = getAuthSessionSnapshot();

      if (!pendingPasswordReset) {
        throw new ApiError({
          message: "Password reset session is missing. Please request a new OTP.",
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
