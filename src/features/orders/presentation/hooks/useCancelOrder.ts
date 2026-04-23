"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { cancelOrderUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import { orderKeys } from "@/features/orders/presentation/state/order.query-keys";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderDTO, ApiError, string>({
    mutationFn: (orderId) => cancelOrderUseCase(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: trackingKeys.all });
    },
  });
}
