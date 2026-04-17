"use client";

import { useMutation } from "@tanstack/react-query";
import { requestForgotPasswordOtp } from "@/features/auth/infrastructure/api/auth.api";
import {
  buildOtpChallenge,
  toForgotPasswordDraft,
} from "@/features/auth/application/services/auth.utils";
import { ApiError } from "@/lib/api/errors";
import {
  setOtpChallengeMeta,
  setPendingPasswordReset,
  setPendingRegistration,
} from "@/features/auth/presentation/state/auth.store";
import type { RequestForgotPasswordOtpInput } from "@/features/auth/domain/types/auth.types";

export function useRequestForgotPasswordOtpMutation() {
  return useMutation<
    { draft: RequestForgotPasswordOtpInput; message: string },
    ApiError,
    RequestForgotPasswordOtpInput
  >({
    mutationFn: async (input: RequestForgotPasswordOtpInput) => {
      const draft = toForgotPasswordDraft(input);
      const response = await requestForgotPasswordOtp(draft.email);

      return {
        draft,
        message: response.message,
      };
    },
    onSuccess: ({ draft }) => {
      setPendingRegistration(null);
      setPendingPasswordReset(draft);
      setOtpChallengeMeta(buildOtpChallenge(draft.email, "FORGOT_PASSWORD"));
    },
  });
}

