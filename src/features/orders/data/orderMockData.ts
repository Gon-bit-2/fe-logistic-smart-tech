import type {
  CreateOrderInput,
  OrderDTO,
  OrderPricing,
  OrderStatus,
  ServiceTier,
} from "@/features/orders/types/order.dto";

export type ServiceTierOption = Readonly<{
  id: ServiceTier;
  label: string;
  description: string;
  highlight?: string;
  price: number;
  accent: "primary" | "tertiary" | "outline";
}>;

export const SERVICE_TIER_OPTIONS: readonly ServiceTierOption[] = [
  {
    id: "express",
    label: "Express Delivery",
    description: "Next-day arrival guaranteed",
    price: 24.5,
    accent: "tertiary",
  },
  {
    id: "eco_green",
    label: "Eco-Green Shared Trip",
    description: "Carbon-neutral shared route with optimized batching",
    highlight: "Save CO2",
    price: 12.2,
    accent: "primary",
  },
  {
    id: "standard",
    label: "Standard Shipping",
    description: "Reliable 3-5 business day service",
    price: 8.9,
    accent: "outline",
  },
];

export const DEFAULT_CREATE_ORDER_INPUT: CreateOrderInput = {
  customerName: "Sustainable Goods Co.",
  contactName: "Elena Tran",
  contactPhone: "+84 903 555 121",
  pickupAddress: "402 Industry Way, Thu Duc Hub, Ho Chi Minh City",
  deliveryAddress: "The Green Plaza, 8th Floor, District 7, Ho Chi Minh City",
  estimatedArrival: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
  receiverName: "Marcus Thorne",
  receiverPhone: "+45 000 111 222",
  itemDescription: "Reusable retail display kits",
  packageWeightKg: 5,
  packageDimensions: "30 x 30 x 40",
  declaredValueUsd: 420,
  serviceTier: "eco_green",
};

export const DEFAULT_TRACKING_ID = "PL-882-990-21";

export function getServiceTierOption(serviceTier: ServiceTier) {
  return (
    SERVICE_TIER_OPTIONS.find((option) => option.id === serviceTier) ??
    SERVICE_TIER_OPTIONS[1]
  );
}

export function calculateOrderPricing(serviceTier: ServiceTier): OrderPricing {
  const service = getServiceTierOption(serviceTier);
  const logisticsFee = 42;
  const handlingFee = service.price;
  const ecoDiscount = serviceTier === "eco_green" ? 2 : 0;
  const subtotal = logisticsFee + handlingFee - ecoDiscount;
  const vat = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + vat).toFixed(2));

  return {
    logisticsFee,
    handlingFee,
    ecoDiscount,
    vat,
    total,
    currency: "USD",
  };
}

function buildStops(input: CreateOrderInput, orderId: string) {
  return [
    {
      id: `${orderId}-placed`,
      label: "Order Placed",
      location: input.pickupAddress,
      status: "completed" as const,
      timestamp: new Date().toISOString(),
    },
    {
      id: `${orderId}-pickup`,
      label: "Picked Up",
      location: "Oslo Carrier Center",
      status: "current" as const,
      timestamp: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: `${orderId}-hub`,
      label: "Arrived at Hub",
      location: "Copenhagen Sustainability Hub",
      status: "pending" as const,
      timestamp: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: `${orderId}-delivery`,
      label: "Out for Delivery",
      location: input.deliveryAddress,
      status: "pending" as const,
      timestamp: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function buildDemoOrder(
  input: CreateOrderInput,
  status: OrderStatus = "draft",
): OrderDTO {
  const reference = `PL-${new Date().getFullYear().toString().slice(-2)}${Date.now()
    .toString()
    .slice(-6)}`;

  return {
    id: reference,
    reference,
    customerName: input.customerName,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    receiverName: input.receiverName,
    receiverPhone: input.receiverPhone,
    pickupAddress: input.pickupAddress,
    deliveryAddress: input.deliveryAddress,
    estimatedArrival:
      input.estimatedArrival ??
      new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    co2SavedKg: input.serviceTier === "eco_green" ? 14 : 4,
    status,
    packageWeightKg: input.packageWeightKg,
    packageDimensions: input.packageDimensions,
    declaredValueUsd: input.declaredValueUsd,
    serviceTier: input.serviceTier,
    itemDescription: input.itemDescription,
    pricing: calculateOrderPricing(input.serviceTier),
    stops: buildStops(input, reference),
  };
}

export function getFallbackOrderById(orderId: string): OrderDTO {
  const order = buildDemoOrder(DEFAULT_CREATE_ORDER_INPUT, "in_transit");

  return {
    ...order,
    id: orderId || DEFAULT_TRACKING_ID,
    reference: orderId || DEFAULT_TRACKING_ID,
    status: "in_transit",
  };
}
