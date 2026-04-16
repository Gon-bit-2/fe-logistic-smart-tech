"use client";

import { useSyncExternalStore } from "react";
import type {
  AuthStatus,
  OtpChallengeMeta,
  RegisterDraft,
} from "@/features/auth/types/auth.types";
import { tokenStorage } from "@/lib/api/token-storage";
import type { SessionTokens } from "@/types/common.type";

type AuthState = {
  accessToken: string | null;
  isHydrated: boolean;
  otpChallengeMeta: OtpChallengeMeta | null;
  pendingRegistration: RegisterDraft | null;
  refreshToken: string | null;
  status: AuthStatus;
};

type AuthSnapshot = AuthState & {
  clearSession: () => void;
  initialize: () => void;
  isAuthenticated: boolean;
  setAuthSessionTokens: (tokens: SessionTokens) => void;
  setOtpChallengeMeta: (challenge: OtpChallengeMeta | null) => void;
  setPendingRegistration: (registration: RegisterDraft | null) => void;
};

const listeners = new Set<() => void>();
const initialState: AuthState = {
  accessToken: null,
  isHydrated: false,
  otpChallengeMeta: null,
  pendingRegistration: null,
  refreshToken: null,
  status: "anonymous",
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
    });
  },

  setAuthSessionTokens(tokens: SessionTokens) {
    tokenStorage.setTokens(tokens);
    setState({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      status: "authenticated",
    });
  },

  setPendingRegistration(pendingRegistration: RegisterDraft | null) {
    setState({
      pendingRegistration,
    });
  },

  setOtpChallengeMeta(otpChallengeMeta: OtpChallengeMeta | null) {
    setState({
      otpChallengeMeta,
    });
  },

  clearSession() {
    tokenStorage.clear();
    setState({
      accessToken: null,
      otpChallengeMeta: null,
      pendingRegistration: null,
      refreshToken: null,
      status: "anonymous",
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

export function setPendingRegistration(registration: RegisterDraft | null) {
  actions.setPendingRegistration(registration);
}

export function setOtpChallengeMeta(challenge: OtpChallengeMeta | null) {
  actions.setOtpChallengeMeta(challenge);
}

export function useAuthStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
