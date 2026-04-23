//green-tech api endpoints
export const API_GET_EMISSION_RECORDS = `/green-tech/trips`;
export const API_CALCULATE_EMISSIONS = (tripId: string | number) =>
  `/green-tech/calculate/${tripId}`;

// fleet api endpoints
export const API_VEHICLES = "/vehicles";
export const API_VEHICLE_DETAIL = (id: string | number) => `/vehicles/${id}`;

// trips api endpoints
export const API_TRIPS = "/trips";
export const API_TRIP_DETAIL = (id: string | number) => `/trips/${id}`;
export const API_TRIP_STATUS = (id: string | number) => `/trips/${id}/status`;
export const API_TRIP_OPTIMIZE_ROUTE = (id: string | number) =>
  `/trips/${id}/optimize-route`;
export const API_TRIP_CANCEL_ORDER = (
  tripId: string | number,
  orderId: string | number,
) => `/trips/${tripId}/cancel-order/${orderId}`;
export const API_TRIP_AUTO_DISPATCH = "/trips/auto-dispatch";
export const API_TRIP_AUTO_DISPATCH_ALL = "/trips/auto-dispatch/all";

// orders api endpoints
export const API_ORDERS = "/orders";
export const API_ORDER_QUOTE = "/orders/quote";
export const API_ORDER_DETAIL = (id: string | number) => `/orders/${id}`;
export const API_ORDER_CANCEL = (id: string | number) => `/orders/${id}/cancel`;
export const API_ORDER_STATUS = (id: string | number) => `/orders/${id}/status`;

// maps api endpoints
export const API_MAPS_PLACES_AUTOCOMPLETE = "/maps/places/autocomplete";
export const API_MAPS_PLACE_DETAIL = "/maps/places/detail";

// tracking api endpoints
export const API_TRACKING_PUBLIC = (trackingCode: string) =>
  `/tracking-events/public/${encodeURIComponent(trackingCode)}`;
export const API_TRACKING_INTERNAL = "/tracking-events";
export const API_TRACKING_NAMESPACE = "/tracking";

// payments api endpoints
export const API_PAYMENT_CREATE_INTENT = (orderId: string | number) =>
  `/payments/create-intent/${orderId}`;
export const API_PAYMENT_ORDER = (orderId: string | number) =>
  `/payments/order/${orderId}`;
export const API_PAYMENT_COD_CONFIRM = (orderId: string | number) =>
  `/payments/cod-confirm/${orderId}`;

// upload api endpoints
export const API_UPLOAD_POD = "/upload/pod";
export const API_UPLOAD_MULTIPLE_POD = "/upload/multiple-pod";
export const API_UPLOAD_IMAGE = "/upload/image"; // Upload ảnh chung (vehicle, hub, etc.)

// analytics api endpoints
export const API_ANALYTICS_DASHBOARD = "/analytics/dashboard";
export const API_ANALYTICS_ORDERS = "/analytics/orders";
export const API_ANALYTICS_EMISSIONS = "/analytics/emissions";
export const API_ANALYTICS_FLEET_PERFORMANCE = "/analytics/fleet-performance";

// hubs api endpoints
export const API_HUBS = "/hubs";
export const API_HUB_DETAIL = (id: string | number) => `/hubs/${id}`;
export const API_HUB_ASSIGN_STAFF = (id: string | number) =>
  `/hubs/${id}/staff`;
export const API_HUB_REMOVE_STAFF = (
  hubId: string | number,
  userId: string | number,
) => `/hubs/${hubId}/staff/${userId}`;

// language api endpoints
export const API_LANGUAGE = "/language";
export const API_LANGUAGE_DETAIL = (languageId: string) =>
  `/language/${languageId}`;

export const API_TRIP_MANUAL = "/trips/manual";
export const API_TRIP_VEHICLE = (id: string | number) => `/trips/${id}/vehicle`;
export const API_TRIP_ORDERS = (id: string | number) => `/trips/${id}/orders`;

// notifications api endpoints
export const API_NOTIFICATIONS = "/notifications";
export const API_NOTIFICATIONS_UNREAD_COUNT = "/notifications/unread-count";
export const API_NOTIFICATIONS_MARK_READ = (id: string | number) =>
  `/notifications/${id}/read`;
export const API_NOTIFICATIONS_MARK_ALL_READ = "/notifications/read-all";

// role requests api endpoints
export const API_ROLE_REQUESTS = "/role-requests";
export const API_ROLE_REQUESTS_ME = "/role-requests/me";
export const API_ROLE_REQUESTS_APPROVE = (id: string | number) =>
  `/role-requests/${id}/approve`;
export const API_ROLE_REQUESTS_REJECT = (id: string | number) =>
  `/role-requests/${id}/reject`;
