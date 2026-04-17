"use client";

import { useAuthStore } from "@/features/auth/presentation/state/auth.store";

export function useAuthSession() {
  return useAuthStore();
}

