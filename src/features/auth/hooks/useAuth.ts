"use client";

import { useAuthStore, type AuthRole } from "@/store/useAuthStore";

export type AuthCredentials = {
  email: string;
  name?: string;
  password: string;
  role?: AuthRole;
};

export function useAuth() {
  const auth = useAuthStore();

  async function login(credentials: AuthCredentials) {
    const user = {
      id: `user-${Date.now()}`,
      name: credentials.name ?? credentials.email.split("@")[0],
      email: credentials.email,
      role: credentials.role ?? "customer",
    } as const;

    auth.setSession({
      token: `demo-token-${Date.now()}`,
      user,
    });

    return user;
  }

  return {
    ...auth,
    login,
    logout: auth.clearSession,
  };
}
