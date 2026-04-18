//green-tech api endpoints
export const API_GET_EMISSION_RECORDS = `/green-tech/trips`;
export const API_CALCULATE_EMISSIONS = `/green-tech/calculate`;

// fleet api endpoints
export const API_VEHICLES = "/vehicles";
export const API_VEHICLE_DETAIL = (id: string | number) => `/vehicles/${id}`;

// trips api endpoints
export const API_TRIPS = "/trips";
export const API_TRIP_DETAIL = (id: string | number) => `/trips/${id}`;

// orders api endpoints
export const API_ORDERS = "/orders";
export const API_ORDER_DETAIL = (id: string | number) => `/orders/${id}`;
export const API_ORDER_STATUS = (id: string | number) => `/orders/${id}/status`;

// tracking api endpoints
export const API_TRACKING_PUBLIC = (trackingCode: string) => `/tracking-events/public/${encodeURIComponent(trackingCode)}`;
export const API_TRACKING_INTERNAL = "/tracking-events";

// analytics api endpoints
export const API_ANALYTICS_DASHBOARD = "/analytics/dashboard";
export const API_ANALYTICS_ORDERS = "/analytics/orders";
export const API_ANALYTICS_EMISSIONS = "/analytics/emissions";
export const API_ANALYTICS_FLEET_PERFORMANCE = "/analytics/fleet-performance";

