"use client";

import { useMutation } from "@tanstack/react-query";
import { registerWithOtp } from "@/features/auth/infrastructure/api/auth.api";
import { ApiError } from "@/lib/api/errors";
import {
  clearOtpFlowState,
  getAuthSessionSnapshot,
} from "@/features/auth/presentation/state/auth.store";
import { useTranslations } from "next-intl";

type RegisterWithOtpMutationInput = {
  code: string;
};

export function useRegisterWithOtpMutation() {
  const tAuthRuntime = useTranslations("auth.runtime");

  return useMutation<unknown, ApiError, RegisterWithOtpMutationInput>({
    mutationFn: async ({ code }: RegisterWithOtpMutationInput) => {
      const { pendingRegistration } = getAuthSessionSnapshot();

      if (!pendingRegistration) {
        throw new ApiError({
          message: tAuthRuntime("missingRegisterSession"),
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
