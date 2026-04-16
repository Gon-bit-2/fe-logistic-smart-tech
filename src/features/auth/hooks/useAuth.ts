"use client";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import { useLogoutMutation } from "@/features/auth/hooks/useLogoutMutation";
import { useRegisterWithOtpMutation } from "@/features/auth/hooks/useRegisterWithOtpMutation";
import { useRequestRegisterOtpMutation } from "@/features/auth/hooks/useRequestRegisterOtpMutation";
import { getAuthSessionSnapshot } from "@/store/useAuthStore";

export function useAuth() {
  const auth = useAuthSession();
  const loginMutation = useLoginMutation();
  const requestOtpMutation = useRequestRegisterOtpMutation();
  const registerMutation = useRegisterWithOtpMutation();
  const logoutMutation = useLogoutMutation();

  return {
    ...auth,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    requestOtpChallenge: requestOtpMutation.mutateAsync,
    resendOtpChallenge: async () => {
      const { pendingRegistration } = getAuthSessionSnapshot();

      if (!pendingRegistration) {
        throw new Error("No pending registration found.");
      }

      return requestOtpMutation.mutateAsync(pendingRegistration);
    },
    verifyOtpChallenge: async (input: { code: string }) =>
      registerMutation.mutateAsync({ code: input.code }),
  };
}
