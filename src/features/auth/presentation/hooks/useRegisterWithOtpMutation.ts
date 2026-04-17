"use client";

import { useMutation } from "@tanstack/react-query";
import { registerWithOtp } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import {
  clearOtpFlowState,
  getAuthSessionSnapshot,
} from "@/features/auth/presentation/state/auth.store";
import { authRuntimeCopy } from "@/i18n/vi";

type RegisterWithOtpMutationInput = {
  code: string;
};

export function useRegisterWithOtpMutation() {
  return useMutation<unknown, ApiError, RegisterWithOtpMutationInput>({
    mutationFn: async ({ code }: RegisterWithOtpMutationInput) => {
      const { pendingRegistration } = getAuthSessionSnapshot();

      if (!pendingRegistration) {
        throw new ApiError({
          message: authRuntimeCopy.missingRegisterSession,
        });
      }

      return registerWithOtp({
        ...pendingRegistration,
        code,
      });
    },
    onSuccess: () => {
      clearOtpFlowState();
    },
  });
}

