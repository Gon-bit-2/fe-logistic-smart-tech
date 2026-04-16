import { apiClient } from "@/lib/api-client";
import type { CreateOrderInput, OrderDTO } from "@/features/orders/types/order.dto";

type CreateOrderResponse = {
  order: OrderDTO;
};

function hasOrderEnvelope(payload: OrderDTO | CreateOrderResponse): payload is CreateOrderResponse {
  return typeof payload === "object" && payload !== null && "order" in payload;
}

export function createOrder(payload: CreateOrderInput) {
  return apiClient<OrderDTO | CreateOrderResponse>("/orders", {
    method: "POST",
    body: payload,
  }).then((response) => {
    if (hasOrderEnvelope(response)) {
      return response.order;
    }

    return response;
  });
}
