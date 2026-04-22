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

function mapOrderRoute(route: OrderRouteApi): OrderRoute {
  return {
    distanceMeters: Number(route.distance?.value ?? 0),
    distanceText: route.distance?.text?.trim() || "Đang cập nhật",
    durationSeconds: Number(route.duration?.value ?? 0),
    durationText: route.duration?.text?.trim() || "Đang cập nhật",
    polyline: route.overview_polyline?.points?.trim() || null,
  };
}

function mapOrderQuoteResponse(payload: OrderQuoteApiResponse): OrderQuoteResponse {
  return {
    quote: {
      currency: "VND",
      distanceKm: Number(payload.quote?.distance ?? 0),
      durationSeconds: Number(payload.quote?.duration ?? 0),
      estimatedCo2Saved: Number(payload.quote?.estimatedCo2Saved ?? 0),
      shippingFee: Number(payload.quote?.shippingFee ?? 0),
      totalVolume: Number(payload.quote?.totalVolume ?? 0),
      totalWeight: Number(payload.quote?.totalWeight ?? 0),
    },
    routes: (payload.routes ?? []).map(mapOrderRoute),
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
