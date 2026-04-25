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

function hasMinimumPhoneLength(value: string) {
  return value.trim().length >= 10;
}

export function getOrderQuoteValidationMessage(input: CreateOrderInput) {
  if (!hasResolvedAddress(input.pickup)) {
    return "Vui lòng chọn địa chỉ lấy hàng từ danh sách gợi ý.";
  }

  if (!hasResolvedAddress(input.delivery)) {
    return "Vui lòng chọn địa chỉ giao hàng từ danh sách gợi ý.";
  }

  if (!input.contactName.trim()) {
    return "Vui lòng nhập tên người gửi.";
  }

  if (!hasMinimumPhoneLength(input.contactPhone)) {
    return "Số điện thoại người gửi cần có ít nhất 10 ký tự.";
  }

  if (!input.receiverName.trim()) {
    return "Vui lòng nhập tên người nhận.";
  }

  if (!hasMinimumPhoneLength(input.receiverPhone)) {
    return "Số điện thoại người nhận cần có ít nhất 10 ký tự.";
  }

  if (Number(input.packageWeightKg) <= 0) {
    return "Vui lòng nhập cân nặng kiện hàng lớn hơn 0.";
  }

  return null;
}

export function canFetchOrderQuote(input: CreateOrderInput) {
  return getOrderQuoteValidationMessage(input) === null;
}

export type OrderQuoteState = {
  canRequestQuote: boolean;
  canSubmit: boolean;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  quote: OrderQuoteResponse | null;
  validationMessage: string | null;
};

export function useOrderQuote(input: CreateOrderInput): OrderQuoteState {
  const validationMessage = getOrderQuoteValidationMessage(input);
  const canRequestQuote = validationMessage === null;
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
      validationMessage,
    }),
    [
      canRequestQuote,
      error,
      quote,
      quoteQuery.error,
      quoteQuery.isFetching,
      quoteQuery.isPending,
      validationMessage,
    ],
  );
}
