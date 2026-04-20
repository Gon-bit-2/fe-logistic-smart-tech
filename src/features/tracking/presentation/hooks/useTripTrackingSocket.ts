"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { TrackingLocationEvent } from "@/features/tracking/domain/types/tracking.types";
import { API_BASE_URL } from "@/lib/api/env";
import { getAuthSessionSnapshot } from "@/features/auth/presentation/state/auth.store";
import { API_TRACKING_NAMESPACE } from "@/utils/apiUrl";

type UseTripTrackingSocketOptions = {
  tripId?: number | null;
};

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

    const accessToken = getAuthSessionSnapshot().accessToken;
    const socket = io(`${API_BASE_URL}${API_TRACKING_NAMESPACE}`, {
      auth: accessToken ? { token: `Bearer ${accessToken}` } : undefined,
      autoConnect: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinTripTracking", { tripId });
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("locationUpdated", handleLocationUpdated);

    return () => {
      socket.emit("leaveTripTracking", { tripId });
      socket.off("locationUpdated", handleLocationUpdated);
      socket.disconnect();
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
