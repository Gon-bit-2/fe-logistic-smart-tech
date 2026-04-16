"use client";

import { useMutation } from "@tanstack/react-query";
import { registerWithOtp } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import {
  clearOtpFlowState,
  getAuthSessionSnapshot,
} from "@/store/useAuthStore";

type RegisterWithOtpMutationInput = {
  code: string;
};

export function useRegisterWithOtpMutation() {
  return useMutation<unknown, ApiError, RegisterWithOtpMutationInput>({
    mutationFn: async ({ code }: RegisterWithOtpMutationInput) => {
      const { pendingRegistration } = getAuthSessionSnapshot();

      if (!pendingRegistration) {
        throw new ApiError({
          message: "Registration session is missing. Please request a new OTP.",
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
