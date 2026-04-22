"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/api/env";
import { getAuthSessionSnapshot } from "@/features/auth/presentation/state/auth.store";
import { API_TRACKING_NAMESPACE } from "@/utils/apiUrl";
import { useQueryClient } from "@tanstack/react-query";
import type { TrackingLocationEvent } from "@/features/tracking/domain/types/tracking.types";
import {
  acquireTrackingSocket,
  releaseTrackingSocket,
} from "@/features/tracking/presentation/lib/tracking-socket.manager";

type DispatcherTripRoomId = number | string;

function normalizeTripRoomId(tripId: DispatcherTripRoomId) {
  const numericTripId = Number(tripId);
  return Number.isNaN(numericTripId) ? String(tripId) : numericTripId;
}

function debugDispatcherSocket(event: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  if (payload === undefined) {
    console.info(`[tracking-socket:dispatcher] ${event}`);
    return;
  }

  console.info(`[tracking-socket:dispatcher] ${event}`, payload);
}

export function useDispatcherSocket(tripIds: readonly DispatcherTripRoomId[] = []) {
  const socketRef = useRef<Socket | null>(null);
  const joinedTripIdsRef = useRef<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const [latestLocation, setLatestLocation] =
    useState<TrackingLocationEvent | null>(null);
  const queryClient = useQueryClient();
  const normalizedTripIds = useMemo(
    () => Array.from(new Set(tripIds.map((tripId) => String(tripId)))).sort(),
    [tripIds],
  );

  const handleTripCreated = useEffectEvent((payload: any) => {
    // Invalidate queries to refresh data on dashboard
    queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
    queryClient.invalidateQueries({ queryKey: ["trips", "list"] });
    queryClient.invalidateQueries({ queryKey: ["fleet", "vehicles"] });
    debugDispatcherSocket("dashboard.tripCreated", payload);
  });

  const handleLocationUpdated = useEffectEvent((payload: TrackingLocationEvent) => {
    setLatestLocation(payload);
    debugDispatcherSocket("locationUpdated", payload);
  });

  const syncTripRooms = useEffectEvent(() => {
    const socket = socketRef.current;

    if (!socket || !socket.connected) {
      return;
    }

    const nextTripIds = new Set(normalizedTripIds);

    for (const joinedTripId of joinedTripIdsRef.current) {
      if (!nextTripIds.has(joinedTripId)) {
        socket.emit("leaveTripTracking", {
          tripId: normalizeTripRoomId(joinedTripId),
        });
        debugDispatcherSocket("left trip room", { tripId: joinedTripId });
      }
    }

    for (const tripId of nextTripIds) {
      if (!joinedTripIdsRef.current.has(tripId)) {
        socket.emit("joinTripTracking", {
          tripId: normalizeTripRoomId(tripId),
        });
        debugDispatcherSocket("joined trip room", { tripId });
      }
    }

    joinedTripIdsRef.current = nextTripIds;
  });

  useEffect(() => {
    if (!API_BASE_URL) {
      return;
    }

    const accessToken = getAuthSessionSnapshot().accessToken ?? undefined;
    const socketUrl = `${API_BASE_URL}${API_TRACKING_NAMESPACE}`;
    const socket = acquireTrackingSocket({
      authToken: accessToken,
      url: socketUrl,
    });
    const handleConnect = () => {
      setIsConnected(true);
      debugDispatcherSocket("connected", { socketId: socket.id });
      syncTripRooms();
    };

    socketRef.current = socket;

    socket.on("connect", handleConnect);

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      joinedTripIdsRef.current = new Set();
      debugDispatcherSocket("disconnected", { reason });
    });

    socket.on("connect_error", (error) => {
      debugDispatcherSocket("connect_error", { message: error.message });
    });

    // Listen for dashboard events
    socket.on("dashboard.tripCreated", handleTripCreated);
    socket.on("locationUpdated", handleLocationUpdated);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      if (socket.connected) {
        for (const tripId of joinedTripIdsRef.current) {
          socket.emit("leaveTripTracking", {
            tripId: normalizeTripRoomId(tripId),
          });
          debugDispatcherSocket("left trip room", { tripId });
        }
      }

      joinedTripIdsRef.current = new Set();
      socket.off("connect", handleConnect);
      socket.off("dashboard.tripCreated", handleTripCreated);
      socket.off("locationUpdated", handleLocationUpdated);
      releaseTrackingSocket({
        authToken: accessToken,
        url: socketUrl,
      });
      debugDispatcherSocket("cleanup release");
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [handleLocationUpdated, handleTripCreated, syncTripRooms]);

  useEffect(() => {
    syncTripRooms();
  }, [normalizedTripIds, syncTripRooms]);

  return {
    isConnected,
    latestLocation,
  };
}
