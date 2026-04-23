import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type {
  CreateOrderApiInput,
  CreateOrderInput,
  OrderApiDto,
  OrderDTO,
  OrderListParams,
  OrderQuoteApiResponse,
  OrderQuoteResponse,
  OrderRoute,
  OrderRouteApi,
  UpdateOrderStatusInput,
} from "@/features/orders/domain/types/order.types";
import {
  mapCreateOrderInputToApiPayload,
  mapCreateOrderInputToQuotePayload,
} from "@/features/orders/application/mappers/create-order-request.mapper";
import { mapOrderApiToViewModel } from "@/features/orders/application/mappers/order.mapper";
import {
  API_ORDER_CANCEL,
  API_ORDERS,
  API_ORDER_DETAIL,
  API_ORDER_QUOTE,
  API_ORDER_STATUS,
} from "@/utils/apiUrl";

type CreateOrderResponse = {
  order: OrderApiDto;
};

function hasOrderEnvelope(
  payload: OrderApiDto | CreateOrderResponse,
): payload is CreateOrderResponse {
  return typeof payload === "object" && payload !== null && "order" in payload;
}

function formatDistanceText(distanceMeters: number) {
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) {
    return "Đang cập nhật";
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function mapOrderRoute(route: OrderRouteApi): OrderRoute {
  const distanceMeters = Number(route.distanceMeters ?? 0);
  const durationSeconds = Number(route.durationSeconds ?? 0);

  return {
    distanceMeters,
    distanceText: formatDistanceText(distanceMeters),
    durationSeconds,
    durationText: "",
    polyline: route.polyline?.trim() || null,
  };
}

function mapOrderQuoteResponse(payload: OrderQuoteApiResponse): OrderQuoteResponse {
  const distanceMeters = Number(payload.distanceMeters ?? 0);
  const durationSeconds = Number(payload.durationSeconds ?? 0);
  const primaryRoute = mapOrderRoute({
    distanceMeters,
    durationSeconds,
    polyline: payload.polyline ?? null,
  });

  return {
    quote: {
      currency: "VND",
      distanceKm: distanceMeters / 1000,
      durationSeconds,
      estimatedCo2Saved: Number(payload.estimatedCo2Saved ?? 0),
      shippingFee: Number(payload.shippingFee ?? 0),
      totalVolume: 0,
      totalWeight: 0,
    },
    routes: [primaryRoute],
  };
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

export async function getOrderQuoteRequest(payload: CreateOrderInput) {
  const apiPayload = mapCreateOrderInputToQuotePayload(payload);
  const response = await httpClient.post<OrderQuoteApiResponse>(API_ORDER_QUOTE, apiPayload);
  return mapOrderQuoteResponse(response.data);
}

export async function getOrderByIdRequest(orderId: string) {
  const response = await httpClient.get<OrderApiDto>(API_ORDER_DETAIL(orderId));
  return mapOrderApiToViewModel(response.data);
}

export async function cancelOrderRequest(orderId: string) {
  const response = await httpClient.patch<OrderApiDto>(API_ORDER_CANCEL(orderId));
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
