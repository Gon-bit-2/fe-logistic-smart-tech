import type { Page, Route } from "@playwright/test";
import {
  sampleOrder,
  sampleOrdersPage,
  sampleTrackingResponse,
} from "../../fixtures/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8386";
const appBaseUrl = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? "3100"}`;
const accessTokenKey = "emerald-logistics.access-token";
const refreshTokenKey = "emerald-logistics.refresh-token";

const sampleDashboard = {
  totalOrders: 1284,
  totalRevenue: 500000000,
  totalDistance: 22000,
  totalCo2Saved: 12400,
  avgDeliveryTime: 18,
  onTimeDeliveryRate: 96,
};

const sampleFleetPerformance = [
  {
    vehicleId: "veh-1",
    licensePlate: "51A-12345",
    totalTrips: 12,
    totalDistance: 560,
    efficiency: 94,
    co2Saved: 380,
  },
];

const sampleVehicleResponse = {
  data: [
    {
      id: "veh-1",
      licensePlate: "51A-12345",
      isActive: true,
      fuelType: "ELECTRIC",
      type: "ELECTRIC_VAN",
    },
  ],
  totalItems: 1,
};

async function fulfillJson(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

export async function registerMockApiRoutes(page: Page) {
  await page.route(`${apiBaseUrl}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();

    if (method === "GET" && pathname === "/") {
      return fulfillJson(route, 200, { ok: true });
    }

    if (method === "POST" && pathname === "/auth/login") {
      return fulfillJson(route, 200, {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      });
    }

    if (method === "POST" && pathname === "/auth/otp") {
      return fulfillJson(route, 200, { message: "OTP sent" });
    }

    if (method === "POST" && pathname === "/auth/register") {
      return fulfillJson(route, 200, { message: "Register success" });
    }

    if (method === "POST" && pathname === "/auth/forgot-password") {
      return fulfillJson(route, 200, { message: "Password reset success" });
    }

    if (method === "POST" && pathname === "/auth/refresh-token") {
      return fulfillJson(route, 200, {
        accessToken: "mock-access-token-refreshed",
        refreshToken: "mock-refresh-token-refreshed",
      });
    }

    if (method === "GET" && pathname === "/orders") {
      return fulfillJson(route, 200, sampleOrdersPage);
    }

    if (method === "POST" && pathname === "/orders") {
      const payload = JSON.parse(request.postData() ?? "{}");
      return fulfillJson(route, 200, {
        order: {
          ...sampleOrder,
          ...payload,
          id: sampleOrder.id,
          reference: sampleOrder.reference,
          status: "PENDING",
        },
      });
    }

    if (method === "GET" && pathname.startsWith("/tracking-events/public/")) {
      const trackingCode = pathname.split("/").pop() ?? sampleTrackingResponse.trackingCode;

      if (trackingCode.toUpperCase() === "MISSING") {
        return fulfillJson(route, 404, {
          message: "Không tìm thấy lô hàng công khai với mã theo dõi này",
        });
      }

      return fulfillJson(route, 200, {
        ...sampleTrackingResponse,
        trackingCode,
      });
    }

    if (method === "GET" && pathname === "/vehicles") {
      return fulfillJson(route, 200, sampleVehicleResponse);
    }

    if (method === "GET" && pathname === "/analytics/dashboard") {
      return fulfillJson(route, 200, sampleDashboard);
    }

    if (method === "GET" && pathname === "/analytics/fleet-performance") {
      return fulfillJson(route, 200, sampleFleetPerformance);
    }

    return fulfillJson(route, 404, {
      message: `Unhandled mock route: ${method} ${pathname}`,
    });
  });
}

export async function seedAuthenticatedSession(page: Page) {
  await page.context().addCookies([
    {
      name: accessTokenKey,
      value: "mock-access-token",
      url: appBaseUrl,
    },
  ]);
  await page.addInitScript(
    ({ accessTokenKey, refreshTokenKey }) => {
      window.localStorage.setItem(accessTokenKey, "mock-access-token");
      window.localStorage.setItem(refreshTokenKey, "mock-refresh-token");
    },
    { accessTokenKey, refreshTokenKey },
  );
}
