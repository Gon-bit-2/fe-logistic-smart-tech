"use client";

import { useAuthStore } from "@/store/useAuthStore";

export function useAuthSession() {
  return useAuthStore();
}
