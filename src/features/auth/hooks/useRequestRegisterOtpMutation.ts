"use client";

import { useMutation } from "@tanstack/react-query";
import { requestRegisterOtp } from "@/features/auth/api/auth.api";
import { buildOtpChallenge, toRegisterDraft } from "@/features/auth/lib/auth.utils";
import { ApiError } from "@/lib/api/errors";
import {
  setOtpChallengeMeta,
  setPendingPasswordReset,
  setPendingRegistration,
} from "@/store/useAuthStore";
import type { RequestRegisterOtpInput } from "@/features/auth/types/auth.types";

export function useRequestRegisterOtpMutation() {
  return useMutation<
    { draft: RequestRegisterOtpInput; message: string },
    ApiError,
    RequestRegisterOtpInput
  >({
    mutationFn: async (input: RequestRegisterOtpInput) => {
      const draft = toRegisterDraft(input);
      const response = await requestRegisterOtp(draft);

      return {
        draft,
        message: response.message,
      };
    },
    onSuccess: ({ draft }) => {
      setPendingPasswordReset(null);
      setPendingRegistration(draft);
      setOtpChallengeMeta(buildOtpChallenge(draft.email, "REGISTER"));
    },
  });
}
