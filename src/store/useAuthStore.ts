"use client";

import { useSyncExternalStore } from "react";

export type AuthRole = "admin" | "driver" | "customer";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

type AuthSnapshot = AuthState & {
  isAuthenticated: boolean;
  clearSession: () => void;
  setSession: (nextState: Partial<AuthState>) => void;
};

const listeners = new Set<() => void>();
const initialState: AuthState = {
  token: null,
  user: null,
};

let state = initialState;

const actions = {
  setSession(nextState: Partial<AuthState>) {
    state = { ...state, ...nextState };
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
