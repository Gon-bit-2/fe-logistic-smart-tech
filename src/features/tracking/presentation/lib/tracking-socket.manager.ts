"use client";

import { io, type Socket } from "socket.io-client";

type TrackingSocketEntry = {
  disconnectTimer: ReturnType<typeof setTimeout> | null;
  refCount: number;
  socket: Socket;
};

type AcquireTrackingSocketOptions = {
  authToken?: string;
  disconnectDelayMs?: number;
  url: string;
};

type TrackingSocketStore = Map<string, TrackingSocketEntry>;

const TRACKING_SOCKET_STORE_KEY = "__emerald_tracking_socket_store__";
const DEFAULT_DISCONNECT_DELAY_MS = 400;

function getTrackingSocketStore() {
  const globalScope = globalThis as typeof globalThis & {
    [TRACKING_SOCKET_STORE_KEY]?: TrackingSocketStore;
  };

  if (!globalScope[TRACKING_SOCKET_STORE_KEY]) {
    globalScope[TRACKING_SOCKET_STORE_KEY] = new Map();
  }

  return globalScope[TRACKING_SOCKET_STORE_KEY];
}

function getSocketStoreKey(url: string, authToken?: string) {
  return `${url}::${authToken ?? ""}`;
}

export function acquireTrackingSocket({
  authToken,
  url,
}: Readonly<AcquireTrackingSocketOptions>) {
  const store = getTrackingSocketStore();
  const storeKey = getSocketStoreKey(url, authToken);
  const existingEntry = store.get(storeKey);

  if (existingEntry) {
    if (existingEntry.disconnectTimer) {
      clearTimeout(existingEntry.disconnectTimer);
      existingEntry.disconnectTimer = null;
    }

    existingEntry.refCount += 1;
    return existingEntry.socket;
  }

  const socket = io(url, {
    auth: authToken ? { token: `Bearer ${authToken}` } : undefined,
    autoConnect: true,
    transports: ["websocket"],
  });

  store.set(storeKey, {
    disconnectTimer: null,
    refCount: 1,
    socket,
  });

  return socket;
}

export function releaseTrackingSocket({
  authToken,
  disconnectDelayMs = DEFAULT_DISCONNECT_DELAY_MS,
  url,
}: Readonly<AcquireTrackingSocketOptions>) {
  const store = getTrackingSocketStore();
  const storeKey = getSocketStoreKey(url, authToken);
  const entry = store.get(storeKey);

  if (!entry) {
    return;
  }

  entry.refCount = Math.max(0, entry.refCount - 1);

  if (entry.refCount > 0 || entry.disconnectTimer) {
    return;
  }

  entry.disconnectTimer = setTimeout(() => {
    const nextEntry = store.get(storeKey);

    if (!nextEntry || nextEntry.refCount > 0) {
      return;
    }

    nextEntry.socket.disconnect();
    store.delete(storeKey);
  }, disconnectDelayMs);
}
