"use client";

import { useMutation } from "@tanstack/react-query";
import { getGoogleLoginLink } from "@/features/auth/api/auth.api";
import type { GoogleLoginLinkResponse } from "@/features/auth/types/auth.types";
import { ApiError } from "@/lib/api/errors";

export function useGoogleLoginMutation() {
  return useMutation<GoogleLoginLinkResponse, ApiError, void>({
    mutationFn: getGoogleLoginLink,
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
    retry: false,
    throwOnError: false,
  });
}
