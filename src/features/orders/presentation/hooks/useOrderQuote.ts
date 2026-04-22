"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderQuoteUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import type {
  CreateOrderInput,
  OrderQuoteResponse,
  ResolvedOrderAddressInput,
} from "@/features/orders/domain/types/order.types";

function hasResolvedAddress(address: ResolvedOrderAddressInput) {
  return (
    address.isResolved &&
    typeof address.latitude === "number" &&
    typeof address.longitude === "number" &&
    Boolean(address.address.trim()) &&
    Boolean(address.placeId?.trim())
  );
}

export function canFetchOrderQuote(input: CreateOrderInput) {
  return (
    hasResolvedAddress(input.pickup) &&
    hasResolvedAddress(input.delivery) &&
    Number(input.packageWeightKg) > 0
  );
}

export type OrderQuoteState = {
  canRequestQuote: boolean;
  canSubmit: boolean;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  quote: OrderQuoteResponse | null;
};

export function useOrderQuote(input: CreateOrderInput): OrderQuoteState {
  const canRequestQuote = canFetchOrderQuote(input);
  const quoteQuery = useQuery<OrderQuoteResponse, Error>({
    enabled: canRequestQuote,
    queryFn: () => getOrderQuoteUseCase(input),
    queryKey: [
      "orders",
      "quote",
      input.pickup.placeId,
      input.pickup.latitude,
      input.pickup.longitude,
      input.delivery.placeId,
      input.delivery.latitude,
      input.delivery.longitude,
      input.serviceTier,
      input.packageWeightKg,
      input.packageDimensions,
      input.itemDescription,
    ],
    retry: false,
    staleTime: 30_000,
  });

  const quote = canRequestQuote ? quoteQuery.data ?? null : null;
  const error = canRequestQuote ? quoteQuery.error?.message ?? null : null;

  return useMemo(
    () => ({
      canRequestQuote,
      canSubmit:
        canRequestQuote &&
        !quoteQuery.isPending &&
        !quoteQuery.isFetching &&
        !quoteQuery.error &&
        Boolean(quote),
      error,
      isLoading: canRequestQuote && quoteQuery.isPending,
      isRefreshing: canRequestQuote && quoteQuery.isFetching && !quoteQuery.isPending,
      quote,
    }),
    [
      canRequestQuote,
      error,
      quote,
      quoteQuery.error,
      quoteQuery.isFetching,
      quoteQuery.isPending,
    ],
  );
}
