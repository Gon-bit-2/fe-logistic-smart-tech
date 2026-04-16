"use client";

import { useMutation } from "@tanstack/react-query";
import { requestForgotPasswordOtp } from "@/features/auth/api/auth.api";
import {
  buildOtpChallenge,
  toForgotPasswordDraft,
} from "@/features/auth/lib/auth.utils";
import { ApiError } from "@/lib/api/errors";
import {
  setOtpChallengeMeta,
  setPendingPasswordReset,
  setPendingRegistration,
} from "@/store/useAuthStore";
import type { RequestForgotPasswordOtpInput } from "@/features/auth/types/auth.types";

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
