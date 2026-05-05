"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MapAutocompletePrediction,
  MapPlaceDetail,
} from "@/features/maps/domain/types/maps.types";
import {
  getPlaceAutocomplete,
  getPlaceDetail,
} from "@/features/maps/infrastructure/api/maps.api";
import type { ResolvedOrderAddressInput } from "@/features/orders/domain/types/order.types";

const AUTOCOMPLETE_MIN_LENGTH = 2;
const AUTOCOMPLETE_DEBOUNCE_MS = 250;

function createUnresolvedDraft(query: string): ResolvedOrderAddressInput {
  return {
    address: "",
    isResolved: false,
    latitude: null,
    longitude: null,
    placeId: null,
    query,
  };
}

function mapPlaceDetailToDraft(detail: MapPlaceDetail): ResolvedOrderAddressInput {
  const address =
    detail.formatted_address?.trim() || detail.name?.trim() || "Đang cập nhật";
  const latitude = detail.geometry?.location?.lat ?? null;
  const longitude = detail.geometry?.location?.lng ?? null;
  const placeId = detail.place_id?.trim() || null;

  if (typeof latitude !== "number" || typeof longitude !== "number" || !placeId) {
    throw new Error("Không thể resolve tọa độ cho địa chỉ đã chọn.");
  }

  return {
    address,
    isResolved: true,
    latitude,
    longitude,
    placeId,
    query: address,
  };
}

function getPredictionLabel(prediction: MapAutocompletePrediction) {
  return prediction.description?.trim() || "Địa chỉ gợi ý";
}

export type ResolvedAddressFieldState = {
  error: string | null;
  isLoadingPredictions: boolean;
  isResolved: boolean;
  isResolvingSelection: boolean;
  predictions: MapAutocompletePrediction[];
  query: string;
  selectPrediction: (prediction: MapAutocompletePrediction) => Promise<void>;
  setQuery: (query: string) => void;
};

export function useResolvedAddressField(
  value: ResolvedOrderAddressInput,
  onChange: (nextValue: ResolvedOrderAddressInput) => void,
): ResolvedAddressFieldState {
  const [debouncedQuery, setDebouncedQuery] = useState(value.query);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(value.query);
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [value.query]);

  const predictionsQuery = useQuery<MapAutocompletePrediction[], Error>({
    enabled: debouncedQuery.trim().length >= AUTOCOMPLETE_MIN_LENGTH,
    queryFn: async () => (await getPlaceAutocomplete(debouncedQuery)).predictions ?? [],
    queryKey: ["maps", "places", "autocomplete", debouncedQuery],
    retry: false,
    staleTime: 30_000,
  });

  const detailMutation = useMutation<ResolvedOrderAddressInput, Error, MapAutocompletePrediction>({
    mutationFn: async (prediction) => {
      const placeId = prediction.place_id?.trim();

      if (!placeId) {
        throw new Error("Gợi ý địa chỉ không chứa place id hợp lệ.");
      }

      const detail = await getPlaceDetail(placeId);
      return mapPlaceDetailToDraft(detail.result ?? {});
    },
    onSuccess: (nextValue) => {
      onChange(nextValue);
    },
  });

  const setQuery = useCallback((query: string) => {
    onChange(createUnresolvedDraft(query));
  }, [onChange]);

  const selectPrediction = useCallback(async (prediction: MapAutocompletePrediction) => {
    try {
      await detailMutation.mutateAsync(prediction);
    } catch {
      onChange(createUnresolvedDraft(getPredictionLabel(prediction)));
    }
  }, [detailMutation, onChange]);

  return useMemo(
    () => ({
      error:
        detailMutation.error?.message ??
        predictionsQuery.error?.message ??
        null,
      isLoadingPredictions:
        debouncedQuery.trim().length >= AUTOCOMPLETE_MIN_LENGTH &&
        predictionsQuery.isFetching,
      isResolved: value.isResolved,
      isResolvingSelection: detailMutation.isPending,
      predictions: value.isResolved ? [] : predictionsQuery.data ?? [],
      query: value.query,
      selectPrediction,
      setQuery,
    }),
    [
      debouncedQuery,
      detailMutation.error?.message,
      detailMutation.isPending,
      predictionsQuery.data,
      predictionsQuery.error?.message,
      predictionsQuery.isFetching,
      selectPrediction,
      setQuery,
      value.isResolved,
      value.query,
    ],
  );
}
