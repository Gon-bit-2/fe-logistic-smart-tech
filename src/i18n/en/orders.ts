import type { OrderPaymentMethod, ServiceTier } from "@/features/orders/domain/types/order.types";
import type { ShipmentFilter } from "@/features/orders/domain/types/shipments-management.types";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  ARRIVED_AT_HUB: "Arrived at hub",
  ASSIGNED: "Assigned",
  CANCELLED: "Cancelled",
  DELIVERED: "Delivered",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  PENDING: "Pending",
  PICKED_UP: "Picked up",
} as const;

export const ORDER_STOP_STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  current: "Current",
  pending: "Pending",
} as const;

export function getOrderStatusLabel(value: string) {
  return ORDER_STATUS_LABELS[value] ?? value;
}

export function getOrderStopStatusLabel(value: string) {
  return ORDER_STOP_STATUS_LABELS[value] ?? value;
}

export const serviceTierOptions = [
  {
    accent: "tertiary",
    description: "Fast delivery with the highest priority for immediate handling and dispatch.",
    id: "express",
    label: "Express delivery",
  },
  {
    accent: "primary",
    description: "Consolidated green shipping that optimizes routing to reduce carbon emissions.",
    highlight: "Lower CO2 emissions",
    id: "eco_green",
    label: "Green consolidated trip",
  },
  {
    accent: "outline",
    description: "Standard delivery at a practical cost for everyday shipping needs.",
    id: "standard",
    label: "Standard delivery",
  },
] as const satisfies readonly {
  accent: "primary" | "tertiary" | "outline";
  description: string;
  highlight?: string;
  id: ServiceTier;
  label: string;
}[];

export const orderFormCopy = {
  addressAutocompleteEmpty: "No matching suggestions found.",
  addressAutocompleteHint: "Enter at least 2 characters and select an address from suggestions.",
  addressAutocompleteLoading: "Searching addresses...",
  addressAutocompleteRequired: "Please select an address from suggestions.",
  addressAutocompleteSuggestion: "Suggested address",
  addressSelected: "Coordinates confirmed",
  contactName: "Contact name",
  contactPhone: "Contact phone",
  createTitle: "Create new order",
  customer: "Customer",
  declaredValue: "Declared value",
  deliveryAddress: "Delivery address",
  dimensions: "Dimensions (cm)",
  estimatedArrival: "Estimated arrival",
  itemDescription: "Item description",
  localMockQuote: "Waiting for system quote",
  orderCreated: "Order created",
  ordersEyebrow: "Orders",
  paymentMethod: "Payment method",
  pricingSourceDescription:
    "Shipping cost, taxes, fees, and carbon savings are calculated automatically by the system.",
  pricingSourceLabel: "Quote source",
  receiverName: "Receiver name",
  receiverPhone: "Receiver phone",
  resolvingAddress: "Resolving coordinates...",
  selectServiceTier: "Select service tier",
  selectPaymentMethod: "Select payment method",
  stepLabels: ["Pickup/delivery", "Details", "Service"],
  submitDisabledAddress: "Select complete addresses from autocomplete to continue.",
  submitDisabledQuote: "The system needs a successful quote before creating the order.",
  submitLoading: "Processing...",
  subtitle: "Set up route, package profile, and service tier.",
  totalQuoted: "total quote",
  weight: "Weight (kg)",
  pickupAddress: "Pickup address",
} as const;

export const paymentMethodOptions = [
  {
    description: "Pay online right after creating the order to move the shipment into processing faster.",
    id: "STRIPE",
    label: "Online payment",
  },
  {
    description: "The driver collects cash on successful delivery and the system reconciles COD internally.",
    id: "COD",
    label: "Cash on delivery",
  },
] as const satisfies readonly {
  description: string;
  id: OrderPaymentMethod;
  label: string;
}[];

export const serviceTierSelectorCopy = {
  apiQuote: "Auto quote",
} as const;

export const routePreviewCopy = {
  distance: "Distance",
  declaredValue: "Declared value",
  delivery: "Delivery point",
  deliveryMissing: "Delivery point not set",
  dimensions: "Dimensions",
  draftSummary: "Draft summary",
  duration: "Duration",
  eta: "ETA",
  mapLoadingDescription: "Syncing the real route from the map system.",
  mapMarkerOnlyDescription: "Address confirmed. The map is showing actual stops.",
  mapPendingDescription:
    "The real map will appear after addresses and shipment weight are completed.",
  newShipment: "New shipment",
  pending: "Pending",
  pendingQuote: "Waiting for quote",
  quoteError: "Unable to fetch quote",
  quotePendingDescription:
    "The real route map will appear after addresses and shipment weight are completed.",
  quoteReady: "Quote received",
  pickup: "Pickup point",
  pickupMissing: "Pickup point not set",
  pricingSourceDescription:
    "The system will update exact shipping cost and environmental indicators after route analysis.",
  pricingSourceLabel: "Quote source",
  routePreview: "Route preview",
  service: "Service",
  shippingFee: "Shipping fee",
  weight: "Weight",
} as const;

export const checkoutCopy = {
  awaitingQuote: "Waiting for quote",
  cardNumber: "Card number",
  cardNumberPlaceholder: "0000 0000 0000 0000",
  cardPayment: "Card payment",
  cardPaymentDescription:
    "Pay securely now so the shipment can be released immediately.",
  codTrackingCta: "Track order",
  cashOnDelivery: "Cash on delivery",
  cashOnDeliveryDescription:
    "Pay when the package reaches the final receiver.",
  checkoutErrorEyebrow: "Payment error",
  checkoutErrorTitle: "No order is available for payment",
  confirmCodOrder: "Confirm COD order",
  cvc: "CVC",
  cvcPlaceholder: "123",
  ecoDiscount: "Green service discount",
  emptyOrderDescription:
    "No order was found for payment. Please try again from order management.",
  expiryDate: "Expiry date",
  expiryPlaceholder: "MM / YY",
  insuranceDescription:
    "Every shipment is insured up to USD 500.00 against damage or loss during transport.",
  insuranceTitle: "Insurance included",
  loadOrder: "Loading order for payment...",
  logisticsFee: "Logistics fee",
  orderSummary: "Order summary",
  payAndConfirmOrder: "Pay and confirm order",
  paymentDetails: "Payment details",
  pendingApiQuote: "Waiting for system quote",
  pricingDescription:
    "The system is fetching an official quote. Please wait a moment.",
  processing: "Processing...",
  redirectToCodTracking:
    "This order uses COD. Track delivery and collection progress from tracking.",
  shippingAndHandling: "Handling fee",
  sustainableChoice: "Sustainable choice",
  sustainabilityMissing:
    "CO2 savings for this shipment will be shown after the system finishes processing environmental data.",
  sustainabilityValue: (value: number) =>
    `This order helps reduce ${value}kg of CO2 emissions.`,
  title: "Checkout",
  totalAmount: "Total payment",
  vat: "VAT",
  orderSubtitle: (reference: string) =>
    `Complete shipment ${reference} and confirm your delivery schedule.`,
} as const;

export const orderCreationWorkspaceCopy = {
  ctaLabel: "Create order and continue",
} as const;

export const orderTimelineCopy = {
  eyebrow: "Tracking",
} as const;

export const orderStatusFilters = ["All", "Pending", "In transit", "Delivered"] as const;
export const orderServiceTierFilters = ["Green", "Express", "Standard"] as const;

export const orderManagementCopy = {
  actions: "Actions",
  customer: "Customer",
  date: "Date",
  description: "1,284 active shipments across global operating routes",
  ecoImpact: "Green impact",
  exportData: "Export data",
  exportSnapshot: "Export snapshot",
  logisticsStatus: "Operations status",
  orderId: "Order ID",
  pageSummary: "Page 1 / 64",
  priority: "Priority",
  recentReduction: "Down 8% from last month",
  refineView: "Refine ecosystem view",
  route: "Route",
  serviceTier: "Service tier",
  showing: "Showing 100 / 1,284 orders",
  status: "Status",
  title: "Order management",
} as const;

export const shipmentFilters: ReadonlyArray<ShipmentFilter> = [
  { label: "All shipments" },
  { label: "Active" },
  { label: "Delayed" },
];

export const shipmentsManagementCopy = {
  activeShipmentsSummary: (visibleCount: number, totalCount: number) =>
    `Showing ${visibleCount} / ${totalCount} matching shipments`,
  addShipment: "Add shipment",
  carbonReport: "View carbon report",
  ecoImpactDescription: "You offset 12.4 tons of CO2 this week.",
  ecoImpactTitle: "Green impact score",
  filterPlaceholder: "Filter by code, vehicle, or route...",
  headings: ["Tracking code", "Route", "Vehicle ID", "Status", "ETA", ""],
  listEmptyDescription:
    "No shipments match the current search criteria.",
  listEmptyTitle: "No shipments to display",
  listErrorDescription:
    "Error loading shipment list. Check your connection or try again later.",
  listErrorTitle: "Unable to load shipment data",
  listLoadingDescription:
    "Loading shipment list...",
  listLoadingTitle: "Loading shipments",
  liveMapButton: "Open full-screen map",
  liveMapEyebrow: "Live network map",
  mapPendingDescription:
    "Real-time dispatch mapping will appear after the system receives official route data.",
  mapPendingTitle: "Dispatch map waiting for connection",
  networkEfficiency: "Network efficiency",
  networkEfficiencyDetail: "Carbon-optimized routes are active",
  summaryLabels: {
    delivered: "Delivered",
    inTransit: "In transit",
    total: "Total shipments",
  },
  subtitle: "Real-time monitoring for the precision distribution network.",
  title: "Shipment management",
  vehiclePending: "Waiting for vehicle assignment",
} as const;
