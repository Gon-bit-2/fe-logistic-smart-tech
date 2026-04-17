import { apiClient } from "@/lib/api-client";
import type { PaginatedResult } from "@/types/common.type";
import type {
  CreateOrderInput,
  OrderDTO,
} from "@/features/orders/domain/types/order.types";

type CreateOrderResponse = {
  order: OrderDTO;
};

function hasOrderEnvelope(
  payload: OrderDTO | CreateOrderResponse,
): payload is CreateOrderResponse {
  return typeof payload === "object" && payload !== null && "order" in payload;
}

export function createOrderRequest(payload: CreateOrderInput) {
  return apiClient<OrderDTO | CreateOrderResponse>("/orders", {
    body: payload,
    method: "POST",
  }).then((response) => {
    if (hasOrderEnvelope(response)) {
      return response.order;
    }

    return response;
  });
}

export function getOrderByIdRequest(orderId: string) {
  return apiClient<OrderDTO>(`/orders/${orderId}`);
}

export function listOrdersRequest() {
  return apiClient<PaginatedResult<OrderDTO>>("/orders", {
    method: "GET",
  });
}

