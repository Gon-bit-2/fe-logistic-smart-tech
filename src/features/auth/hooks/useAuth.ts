"use client";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import { useLogoutMutation } from "@/features/auth/hooks/useLogoutMutation";
import { useForgotPasswordMutation } from "@/features/auth/hooks/useForgotPasswordMutation";
import { useRegisterWithOtpMutation } from "@/features/auth/hooks/useRegisterWithOtpMutation";
import { useRequestForgotPasswordOtpMutation } from "@/features/auth/hooks/useRequestForgotPasswordOtpMutation";
import { useRequestRegisterOtpMutation } from "@/features/auth/hooks/useRequestRegisterOtpMutation";
import { getAuthSessionSnapshot } from "@/store/useAuthStore";

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
        throw new Error("No pending registration found.");
      }

      return requestOtpMutation.mutateAsync(pendingRegistration);
    },
    resetPasswordWithOtp: async (input: { code: string }) =>
      forgotPasswordMutation.mutateAsync({ code: input.code }),
    verifyOtpChallenge: async (input: { code: string }) =>
      registerMutation.mutateAsync({ code: input.code }),
  };
}
