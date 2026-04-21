import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type {
  CreateOrderApiInput,
  CreateOrderInput,
  OrderApiDto,
  OrderDTO,
  OrderListParams,
  UpdateOrderStatusInput,
} from "@/features/orders/domain/types/order.types";
import { mapCreateOrderInputToApiPayload } from "@/features/orders/application/mappers/create-order-request.mapper";
import { mapOrderApiToViewModel } from "@/features/orders/application/mappers/order.mapper";
import { API_ORDERS, API_ORDER_DETAIL, API_ORDER_STATUS } from "@/utils/apiUrl";

type CreateOrderResponse = {
  order: OrderApiDto;
};

function hasOrderEnvelope(
  payload: OrderApiDto | CreateOrderResponse,
): payload is CreateOrderResponse {
  return typeof payload === "object" && payload !== null && "order" in payload;
}

export async function createOrderRequest(payload: CreateOrderInput) {
  const apiPayload: CreateOrderApiInput = mapCreateOrderInputToApiPayload(payload);
  const response = await httpClient.post<OrderApiDto | CreateOrderResponse>(
    API_ORDERS,
    apiPayload,
  );
  if (hasOrderEnvelope(response.data)) {
    return mapOrderApiToViewModel(response.data.order);
  }
  return mapOrderApiToViewModel(response.data);
}

export async function getOrderByIdRequest(orderId: string) {
  const response = await httpClient.get<OrderApiDto>(API_ORDER_DETAIL(orderId));
  return mapOrderApiToViewModel(response.data);
}

export async function listOrdersRequest(params?: OrderListParams) {
  const response = await httpClient.get<PaginatedResult<OrderApiDto>>(API_ORDERS, {
    params,
  });
  return {
    data: response.data.data.map(mapOrderApiToViewModel),
    totalItems: response.data.totalItems,
  };
}

export async function updateOrderStatusRequest(orderId: string, payload: UpdateOrderStatusInput) {
  const response = await httpClient.put<OrderApiDto>(API_ORDER_STATUS(orderId), payload);
  return mapOrderApiToViewModel(response.data);
}

export async function deleteOrderRequest(orderId: string) {
  const response = await httpClient.delete<OrderApiDto>(API_ORDER_DETAIL(orderId));
  return mapOrderApiToViewModel(response.data);
}
