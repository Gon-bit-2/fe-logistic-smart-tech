// auth api endpoints
export const API_AUTH_OTP = "/auth/otp";
export const API_AUTH_REGISTER = "/auth/register";
export const API_AUTH_FORGOT_PASSWORD = "/auth/forgot-password";
export const API_AUTH_PROFILE = "/auth/profile";
export const API_AUTH_ADDRESS_BOOK = "/auth/address-book";
export const API_AUTH_ADDRESS_BOOK_DETAIL = (id: string | number) => `/auth/address-book/${id}`;
export const API_AUTH_GOOGLE_LINK = "/auth/google-link";

// session routes
export const API_SESSION_LOGIN = "/api/auth/session/login";
export const API_SESSION_LOGOUT = "/api/auth/session";
export const API_SESSION_GOOGLE = "/api/auth/session/google";

//green-tech api endpoints
export const API_GET_EMISSION_RECORDS = (tripId: string | number) => `/green-tech/trips/${tripId}`;
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
export const API_TRIP_DISPATCH_PREVIEW = "/trips/dispatch-preview";
export const API_TRIP_DISPATCH_BOARD = "/trips/dispatch-board";
export const API_TRIP_DISPATCH_APPROVE = "/trips/dispatch-approve";
export const API_DRIVER_DISPATCH_BOARD = "/trips/driver-dispatch-board";
export const API_DRIVER_ASSIGNMENT_REQUESTS = "/trips/driver-assignment-requests";
export const API_ASSIGNMENT_REQUESTS = "/trips/assignment-requests";
export const API_ASSIGNMENT_REQUEST_APPROVE = (id: string | number) =>
  `/trips/assignment-requests/${id}/approve`;
export const API_ASSIGNMENT_REQUEST_REJECT = (id: string | number) =>
  `/trips/assignment-requests/${id}/reject`;

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
export const API_NOTIFICATIONS_NAMESPACE = "/notifications";

// payments api endpoints
export const API_PAYMENT_CREATE_INTENT = (orderId: string | number) =>
  `/payments/create-intent/${orderId}`;
export const API_PAYMENT_ORDER = (orderId: string | number) =>
  `/payments/order/${orderId}`;
export const API_PAYMENT_COD_CONFIRM = (orderId: string | number) =>
  `/payments/cod-confirm/${orderId}`;

// wallet api endpoints
export const API_WALLET_MY_WALLET = "/wallet/my-wallet";
export const API_WALLET_RECONCILE_COD = "/wallet/reconcile-cod";

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
export const API_HUB_ASSIGNABLE_USERS = (id: string | number) =>
  `/hubs/${id}/assignable-users`;
export const API_HUB_ASSIGN_STAFF = (id: string | number) =>
  `/hubs/${id}/staff`;
export const API_HUB_ASSIGN_DRIVER = (id: string | number) =>
  `/hubs/${id}/drivers`;
export const API_HUB_REMOVE_STAFF = (
  hubId: string | number,
  userId: string | number,
) => `/hubs/${hubId}/staff/${userId}`;
export const API_HUB_REMOVE_DRIVER = (
  hubId: string | number,
  userId: string | number,
) => `/hubs/${hubId}/drivers/${userId}`;

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
export const API_NOTIFICATION_PREFERENCES = "/notifications/preferences";

// observability api endpoints
export const API_ADMIN_OBSERVABILITY_QUEUES = "/admin/observability/queues";
export const API_ADMIN_OBSERVABILITY_FAILED_JOBS = (name: string) =>
  `/admin/observability/queues/${encodeURIComponent(name)}/failed-jobs`;
export const API_ADMIN_OBSERVABILITY_SLOW_ENDPOINTS =
  "/admin/observability/slow-endpoints";
export const API_ADMIN_OBSERVABILITY_AUDIT_LOGS =
  "/admin/observability/audit-logs";

// role requests api endpoints
export const API_ROLE_REQUESTS = "/role-requests";
export const API_ROLE_REQUESTS_ME = "/role-requests/me";
export const API_ROLE_REQUESTS_APPROVE = (id: string | number) =>
  `/role-requests/${id}/approve`;
export const API_ROLE_REQUESTS_REJECT = (id: string | number) =>
  `/role-requests/${id}/reject`;
