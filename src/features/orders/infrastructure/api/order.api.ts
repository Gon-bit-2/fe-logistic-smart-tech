import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type {
  CreateOrderInput,
  OrderDTO,
  OrderListParams,
  UpdateOrderStatusInput,
} from "@/features/orders/domain/types/order.types";
import { API_ORDERS, API_ORDER_DETAIL, API_ORDER_STATUS } from "@/utils/apiUrl";

type CreateOrderResponse = {
  order: OrderDTO;
};

function hasOrderEnvelope(
  payload: OrderDTO | CreateOrderResponse,
): payload is CreateOrderResponse {
  return typeof payload === "object" && payload !== null && "order" in payload;
}

export async function createOrderRequest(payload: CreateOrderInput) {
  const response = await httpClient.post<OrderDTO | CreateOrderResponse>(API_ORDERS, payload);
  if (hasOrderEnvelope(response.data)) {
    return response.data.order;
  }
  return response.data;
}

export async function getOrderByIdRequest(orderId: string) {
  const response = await httpClient.get<OrderDTO>(API_ORDER_DETAIL(orderId));
  return response.data;
}

export async function listOrdersRequest(params?: OrderListParams) {
  const response = await httpClient.get<PaginatedResult<OrderDTO>>(API_ORDERS, { params });
  return response.data;
}

export async function updateOrderStatusRequest(orderId: string, payload: UpdateOrderStatusInput) {
  const response = await httpClient.put<OrderDTO>(API_ORDER_STATUS(orderId), payload);
  return response.data;
}

export async function deleteOrderRequest(orderId: string) {
  const response = await httpClient.delete<OrderDTO>(API_ORDER_DETAIL(orderId));
  return response.data;
}

