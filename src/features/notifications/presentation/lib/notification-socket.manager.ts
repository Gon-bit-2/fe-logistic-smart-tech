"use client";

import { io, type Socket } from "socket.io-client";

type NotificationSocketEntry = {
  disconnectTimer: ReturnType<typeof setTimeout> | null;
  refCount: number;
  socket: Socket;
};

type AcquireNotificationSocketOptions = {
  authToken?: string;
  disconnectDelayMs?: number;
  url: string;
};

const NOTIFICATION_SOCKET_STORE_KEY = "__emerald_notification_socket_store__";
const DEFAULT_DISCONNECT_DELAY_MS = 400;

function getNotificationSocketStore() {
  const globalScope = globalThis as typeof globalThis & {
    [NOTIFICATION_SOCKET_STORE_KEY]?: Map<string, NotificationSocketEntry>;
  };

  if (!globalScope[NOTIFICATION_SOCKET_STORE_KEY]) {
    globalScope[NOTIFICATION_SOCKET_STORE_KEY] = new Map();
  }

  return globalScope[NOTIFICATION_SOCKET_STORE_KEY];
}

function getSocketStoreKey(url: string, authToken?: string) {
  return `${url}::${authToken ?? ""}`;
}

export function acquireNotificationSocket({
  authToken,
  url,
}: Readonly<AcquireNotificationSocketOptions>) {
  const store = getNotificationSocketStore();
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
    auth: authToken ? { token: authToken } : undefined,
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

export function releaseNotificationSocket({
  authToken,
  disconnectDelayMs = DEFAULT_DISCONNECT_DELAY_MS,
  url,
}: Readonly<AcquireNotificationSocketOptions>) {
  const store = getNotificationSocketStore();
  const storeKey = getSocketStoreKey(url, authToken);
  const entry = store.get(storeKey);

  if (!entry) return;

  entry.refCount = Math.max(0, entry.refCount - 1);

  if (entry.refCount > 0 || entry.disconnectTimer) return;

  entry.disconnectTimer = setTimeout(() => {
    const nextEntry = store.get(storeKey);
    if (!nextEntry || nextEntry.refCount > 0) return;

    nextEntry.socket.disconnect();
    store.delete(storeKey);
  }, disconnectDelayMs);
}
