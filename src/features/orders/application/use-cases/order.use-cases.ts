import { hasApiBaseUrl } from "@/lib/api/env";
import type {
  CreateOrderInput,
  OrderDTO,
  OrderQuoteResponse,
  PaymentMethod,
  OrderListParams,
  UpdateOrderStatusInput,
} from "@/features/orders/domain/types/order.types";
import {
  createOrderRequest,
  getOrderByIdRequest,
  getOrderQuoteRequest,
  listOrdersRequest,
  updateOrderStatusRequest,
  deleteOrderRequest,
} from "@/features/orders/infrastructure/api/order.api";
import {
  findStoredOrder,
  patchStoredOrder,
  upsertStoredOrder,
} from "@/features/orders/infrastructure/storage/order-session.storage";

const ORDERS_API_CONFIGURATION_ERROR =
  "Orders API chưa được cấu hình. Hãy thiết lập NEXT_PUBLIC_API_BASE_URL trước khi dùng luồng này.";

function assertOrdersApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new Error(ORDERS_API_CONFIGURATION_ERROR);
  }
}

export async function createOrderUseCase(input: CreateOrderInput) {
  assertOrdersApiConfigured();

  const order = await createOrderRequest(input);
  return upsertStoredOrder(order);
}

export async function getOrderQuoteUseCase(input: CreateOrderInput): Promise<OrderQuoteResponse> {
  assertOrdersApiConfigured();
  return getOrderQuoteRequest(input);
}

export async function resolveCheckoutOrderUseCase(params: {
  orderId: string | null;
  reference: string | null;
}) {
  const lookupKey = params.orderId ?? params.reference;

  if (!lookupKey) {
    throw new Error("Thiếu `orderId` trong URL thanh toán.");
  }

  const storedOrder = findStoredOrder(lookupKey);

  if (storedOrder) {
    return storedOrder;
  }

  if (!params.orderId) {
    throw new Error(
      "Không tìm thấy đơn hàng trong phiên trình duyệt hiện tại. Hãy mở checkout từ luồng tạo đơn hoặc cung cấp `orderId`.",
    );
  }

  assertOrdersApiConfigured();

  const order = await getOrderByIdRequest(params.orderId);
  return upsertStoredOrder(order);
}

export async function confirmCheckoutUseCase(
  order: OrderDTO,
  paymentMethod: PaymentMethod,
) {
  const nextOrder =
    patchStoredOrder(order.id, {
      paymentMethod,
      status: "IN_TRANSIT",
    }) ?? {
      ...order,
      paymentMethod,
      status: "IN_TRANSIT",
    };

  return upsertStoredOrder(nextOrder);
}

export async function listOrdersUseCase(params?: OrderListParams) {
  assertOrdersApiConfigured();
  return listOrdersRequest(params);
}

export async function getOrderDetailUseCase(orderId: string) {
  assertOrdersApiConfigured();
  return getOrderByIdRequest(orderId);
}

export async function updateOrderStatusUseCase(orderId: string, payload: UpdateOrderStatusInput) {
  assertOrdersApiConfigured();
  return updateOrderStatusRequest(orderId, payload);
}

export async function deleteOrderUseCase(orderId: string) {
  assertOrdersApiConfigured();
  return deleteOrderRequest(orderId);
}
