"use client";

import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import { useLoginMutation } from "@/features/auth/presentation/hooks/useLoginMutation";
import { useLogoutMutation } from "@/features/auth/presentation/hooks/useLogoutMutation";
import { useForgotPasswordMutation } from "@/features/auth/presentation/hooks/useForgotPasswordMutation";
import { useRegisterWithOtpMutation } from "@/features/auth/presentation/hooks/useRegisterWithOtpMutation";
import { useRequestForgotPasswordOtpMutation } from "@/features/auth/presentation/hooks/useRequestForgotPasswordOtpMutation";
import { useRequestRegisterOtpMutation } from "@/features/auth/presentation/hooks/useRequestRegisterOtpMutation";
import { getAuthSessionSnapshot } from "@/features/auth/presentation/state/auth.store";
import { authRuntimeCopy } from "@/i18n/vi";

export function useAuth() {
  const auth = useAuthSession();
  const loginMutation = useLoginMutation();
  const requestOtpMutation = useRequestRegisterOtpMutation();
  const requestForgotPasswordOtpMutation = useRequestForgotPasswordOtpMutation();
  const registerMutation = useRegisterWithOtpMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const logoutMutation = useLogoutMutation();

  return {
    ...auth,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    requestForgotPasswordChallenge: requestForgotPasswordOtpMutation.mutateAsync,
    requestOtpChallenge: requestOtpMutation.mutateAsync,
    resendOtpChallenge: async () => {
      const { pendingRegistration } = getAuthSessionSnapshot();

      if (!pendingRegistration) {
        throw new Error(authRuntimeCopy.missingPendingRegistration);
      }

      return requestOtpMutation.mutateAsync(pendingRegistration);
    },
    resetPasswordWithOtp: async (input: { code: string }) =>
      forgotPasswordMutation.mutateAsync({ code: input.code }),
    verifyOtpChallenge: async (input: { code: string }) =>
      registerMutation.mutateAsync({ code: input.code }),
  };
}

