"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createOrderUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import type {
  CreateOrderInput,
  OrderDTO,
} from "@/features/orders/domain/types/order.types";

export function useCreateOrder() {
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const mutation = useMutation<OrderDTO, Error, CreateOrderInput>({
    mutationFn: createOrderUseCase,
    onSuccess: (nextOrder) => {
      setOrder(nextOrder);
    },
  });

  return {
    error: mutation.error?.message ?? null,
    isPending: mutation.isPending,
    mutateAsync: mutation.mutateAsync,
    order,
  };
}

