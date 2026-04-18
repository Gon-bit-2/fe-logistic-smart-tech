"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderDTO, UpdateOrderStatusInput } from "@/features/orders/domain/types/order.types";
import { updateOrderStatusUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import { orderKeys } from "@/features/orders/presentation/state/order.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    OrderDTO,
    ApiError,
    { orderId: string; payload: UpdateOrderStatusInput }
  >({
    mutationFn: ({ orderId, payload }) => updateOrderStatusUseCase(orderId, payload),
    onSuccess: (data) => {
      // Invalidate both list and detail query to refresh data
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      // Can also optimistically update the detail cache if needed
      queryClient.setQueryData(orderKeys.detail(data.id), data);
    },
  });
}
