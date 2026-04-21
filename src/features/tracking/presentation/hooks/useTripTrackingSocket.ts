"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import type { TrackingLocationEvent } from "@/features/tracking/domain/types/tracking.types";
import { API_BASE_URL } from "@/lib/api/env";
import { getAuthSessionSnapshot } from "@/features/auth/presentation/state/auth.store";
import { API_TRACKING_NAMESPACE } from "@/utils/apiUrl";
import {
  acquireTrackingSocket,
  releaseTrackingSocket,
} from "@/features/tracking/presentation/lib/tracking-socket.manager";

type UseTripTrackingSocketOptions = {
  tripId?: number | null;
};

function debugTripTrackingSocket(event: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  if (payload === undefined) {
    console.info(`[tracking-socket:trip] ${event}`);
    return;
  }

  console.info(`[tracking-socket:trip] ${event}`, payload);
}

export function useTripTrackingSocket({
  tripId,
}: Readonly<UseTripTrackingSocketOptions>) {
  const socketRef = useRef<Socket | null>(null);
  const [latestLocation, setLatestLocation] = useState<TrackingLocationEvent | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(false);

  const handleLocationUpdated = useEffectEvent((payload: TrackingLocationEvent) => {
    setLatestLocation(payload);
  });

  useEffect(() => {
    if (!API_BASE_URL || !tripId) {
      return;
    }

    const accessToken = getAuthSessionSnapshot().accessToken ?? undefined;
    const socketUrl = `${API_BASE_URL}${API_TRACKING_NAMESPACE}`;
    const socket = acquireTrackingSocket({
      authToken: accessToken,
      url: socketUrl,
    });
    const joinTripRoom = () => {
      setIsConnected(true);
      debugTripTrackingSocket("connected", { tripId, socketId: socket.id });
      socket.emit("joinTripTracking", { tripId });
      debugTripTrackingSocket("joined trip room", { tripId });
    };

    socketRef.current = socket;

    socket.on("connect", joinTripRoom);
    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      debugTripTrackingSocket("disconnected", { tripId, reason });
    });
    socket.on("connect_error", (error) => {
      debugTripTrackingSocket("connect_error", {
        tripId,
        message: error.message,
      });
    });
    socket.on("locationUpdated", handleLocationUpdated);

    if (socket.connected) {
      joinTripRoom();
    }

    return () => {
      if (socket.connected) {
        socket.emit("leaveTripTracking", { tripId });
        debugTripTrackingSocket("left trip room", { tripId });
      }

      socket.off("connect", joinTripRoom);
      socket.off("locationUpdated", handleLocationUpdated);
      releaseTrackingSocket({
        authToken: accessToken,
        url: socketUrl,
      });
      debugTripTrackingSocket("cleanup release", { tripId });
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [handleLocationUpdated, tripId]);

  function publishDriverLocationUpdate(lat: number, lng: number) {
    if (!tripId || !socketRef.current) {
      return;
    }

    socketRef.current.emit("driverLocationUpdate", {
      lat,
      lng,
      tripId,
    });
  }

  return {
    isConnected,
    latestLocation,
    publishDriverLocationUpdate,
  };
}
