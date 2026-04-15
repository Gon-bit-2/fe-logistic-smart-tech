"use client";

import { useSyncExternalStore } from "react";
import type {
  AuthCredentials,
  AuthRole,
  OtpChallenge,
} from "@/features/auth/types/auth.types";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  otpChallenge: OtpChallenge | null;
  pendingRegistration: AuthCredentials | null;
};

type AuthSnapshot = AuthState & {
  isAuthenticated: boolean;
  clearSession: () => void;
  clearOtpChallenge: () => void;
  setSession: (nextState: Partial<AuthState>) => void;
  setOtpChallenge: (
    challenge: OtpChallenge,
    registration?: AuthCredentials | null,
  ) => void;
};

const listeners = new Set<() => void>();
const initialState: AuthState = {
  token: null,
  user: null,
  otpChallenge: null,
  pendingRegistration: null,
};

let state = initialState;

const actions = {
  setSession(nextState: Partial<AuthState>) {
    state = { ...state, ...nextState };
    emit();
  },
  setOtpChallenge(challenge: OtpChallenge, registration?: AuthCredentials | null) {
    state = {
      ...state,
      otpChallenge: challenge,
      pendingRegistration: registration ?? state.pendingRegistration,
    };
    emit();
  },
  clearOtpChallenge() {
    state = {
      ...state,
      otpChallenge: null,
      pendingRegistration: null,
    };
    emit();
  },
  clearSession() {
    state = initialState;
    emit();
  },
};

function createSnapshot(): AuthSnapshot {
  return {
    ...state,
    isAuthenticated: Boolean(state.token),
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

export function useAuthStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
