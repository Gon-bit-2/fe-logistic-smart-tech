"use client";

import { useSyncExternalStore } from "react";
import type {
  AuthStatus,
  ForgotPasswordDraft,
  OtpChallengeMeta,
  RegisterDraft,
} from "@/features/auth/domain/types/auth.types";
import type { AuthUser } from "@/features/auth/domain/types/auth.types";
import { tokenStorage } from "@/lib/api/token-storage";
import { extractAuthUserFromToken } from "@/features/auth/application/services/auth-session";
import type { SessionTokens } from "@/types/common.type";

type AuthState = {
  accessToken: string | null;
  isHydrated: boolean;
  otpChallengeMeta: OtpChallengeMeta | null;
  pendingPasswordReset: ForgotPasswordDraft | null;
  pendingRegistration: RegisterDraft | null;
  refreshToken: string | null;
  status: AuthStatus;
  user: AuthUser | null;
};

type AuthSnapshot = AuthState & {
  clearOtpFlowState: () => void;
  clearSession: () => void;
  initialize: () => void;
  isAuthenticated: boolean;
  setAuthSessionTokens: (tokens: SessionTokens) => void;
  setOtpChallengeMeta: (challenge: OtpChallengeMeta | null) => void;
  setPendingPasswordReset: (passwordReset: ForgotPasswordDraft | null) => void;
  setPendingRegistration: (registration: RegisterDraft | null) => void;
};

const listeners = new Set<() => void>();
const initialState: AuthState = {
  accessToken: null,
  isHydrated: false,
  otpChallengeMeta: null,
  pendingPasswordReset: null,
  pendingRegistration: null,
  refreshToken: null,
  status: "anonymous",
  user: null,
};

let state = initialState;
let hasInitialized = false;

function computeStatus(nextState: Pick<AuthState, "accessToken">): AuthStatus {
  return nextState.accessToken ? "authenticated" : "anonymous";
}

function setState(nextState: Partial<AuthState>) {
  state = {
    ...state,
    ...nextState,
  };
  emit();
}

const actions = {
  initialize() {
    if (hasInitialized) {
      if (!state.isHydrated) {
        setState({ isHydrated: true });
      }

      return;
    }

    hasInitialized = true;

    const tokens = tokenStorage.getTokens();

    setState({
      accessToken: tokens?.accessToken ?? null,
      isHydrated: true,
      refreshToken: tokens?.refreshToken ?? null,
      status: computeStatus({
        accessToken: tokens?.accessToken ?? null,
      }),
      user: tokens?.accessToken ? extractAuthUserFromToken(tokens.accessToken) : null,
    });
  },

  setAuthSessionTokens(tokens: SessionTokens) {
    tokenStorage.setTokens(tokens);
    setState({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      status: "authenticated",
      user: extractAuthUserFromToken(tokens.accessToken),
    });
  },

  setPendingRegistration(pendingRegistration: RegisterDraft | null) {
    setState({
      pendingRegistration,
    });
  },

  setPendingPasswordReset(pendingPasswordReset: ForgotPasswordDraft | null) {
    setState({
      pendingPasswordReset,
    });
  },

  setOtpChallengeMeta(otpChallengeMeta: OtpChallengeMeta | null) {
    setState({
      otpChallengeMeta,
    });
  },

  clearOtpFlowState() {
    setState({
      otpChallengeMeta: null,
      pendingPasswordReset: null,
      pendingRegistration: null,
    });
  },

  clearSession() {
    tokenStorage.clear();
    setState({
      accessToken: null,
      otpChallengeMeta: null,
      pendingPasswordReset: null,
      pendingRegistration: null,
      refreshToken: null,
      status: "anonymous",
      user: null,
    });
  },
};

function createSnapshot(): AuthSnapshot {
  return {
    ...state,
    isAuthenticated: Boolean(state.accessToken),
    ...actions,
  };
}

let snapshot = createSnapshot();

function emit() {
  snapshot = createSnapshot();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

export function initializeAuthStore() {
  actions.initialize();
}

export function getAuthSessionSnapshot() {
  return snapshot;
}

export function setAuthSessionTokens(tokens: SessionTokens) {
  actions.setAuthSessionTokens(tokens);
}

export function clearAuthSession() {
  actions.clearSession();
}

export function clearOtpFlowState() {
  actions.clearOtpFlowState();
}

export function setPendingRegistration(registration: RegisterDraft | null) {
  actions.setPendingRegistration(registration);
}

export function setPendingPasswordReset(passwordReset: ForgotPasswordDraft | null) {
  actions.setPendingPasswordReset(passwordReset);
}

export function setOtpChallengeMeta(challenge: OtpChallengeMeta | null) {
  actions.setOtpChallengeMeta(challenge);
}

export function useAuthStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

