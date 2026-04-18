"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { deleteOrderUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import { orderKeys } from "@/features/orders/presentation/state/order.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderDTO, ApiError, string>({
    mutationFn: (orderId) => deleteOrderUseCase(orderId),
    onSuccess: () => {
      // Invalidate to refresh the list
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
