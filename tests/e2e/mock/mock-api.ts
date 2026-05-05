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
const seededAccessTokens = new WeakMap<Page, string>();

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

const sampleOrderAnalytics = [
  {
    avgDeliveryTime: 18,
    count: 12,
    period: "2026-W16",
    revenue: 500000000,
  },
];

const sampleEmissionAnalytics = [
  {
    co2Emitted: 320,
    co2Saved: 124,
    greenTripsCount: 8,
    period: "2026-W16",
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

function createMockAccessToken(role: "admin" | "customer" = "customer") {
  const roleId = role === "admin" ? 1 : 2;
  const payload = {
    deviceId: 1,
    exp: 4_102_444_800,
    iat: 1_712_678_400,
    roleId,
    roleName: role,
    userId: role === "admin" ? 1 : 2,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `header.${encodedPayload}.signature`;
}

async function fulfillJson(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

function getCookieValue(cookieHeader: string | undefined, key: string) {
  return cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`))
    ?.slice(key.length + 1);
}

export async function registerMockApiRoutes(page: Page) {
  await page.route("**/api/auth/session/login", async (route) => {
    if (route.request().method() !== "POST") {
      return route.fallback();
    }

    const accessToken = createMockAccessToken("customer");
    seededAccessTokens.set(page, accessToken);
    await page.context().addCookies([
      {
        name: accessTokenKey,
        value: accessToken,
        url: appBaseUrl,
      },
      {
        name: refreshTokenKey,
        value: "mock-refresh-token",
        url: appBaseUrl,
      },
    ]);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Set-Cookie": `${accessTokenKey}=${accessToken}; Path=/; HttpOnly; SameSite=Lax`,
      },
      body: JSON.stringify({ accessToken }),
    });
  });

  await page.route("**/api/auth/session**", async (route) => {
    const method = route.request().method();
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === "/api/auth/session/login" && method === "POST") {
      const accessToken = createMockAccessToken("customer");
      seededAccessTokens.set(page, accessToken);
      await page.context().addCookies([
        {
          name: accessTokenKey,
          value: accessToken,
          url: appBaseUrl,
        },
        {
          name: refreshTokenKey,
          value: "mock-refresh-token",
          url: appBaseUrl,
        },
      ]);
      return fulfillJson(route, 200, { accessToken });
    }

    if (pathname !== "/api/auth/session") {
      return route.fallback();
    }

    if (method === "GET") {
      const accessToken =
        getCookieValue(route.request().headers().cookie, accessTokenKey) ??
        seededAccessTokens.get(page);

      if (!accessToken) {
        return route.fulfill({
          status: 204,
          headers: { "Cache-Control": "no-store" },
        });
      }

      return fulfillJson(route, 200, { accessToken });
    }

    if (method === "DELETE") {
      return fulfillJson(route, 200, { message: "Logged out" });
    }

    return route.fallback();
  });

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
        accessToken: createMockAccessToken("customer"),
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
        accessToken: createMockAccessToken("customer"),
        refreshToken: "mock-refresh-token-refreshed",
      });
    }

    if (method === "GET" && pathname === "/orders") {
      return fulfillJson(route, 200, sampleOrdersPage);
    }

    if (method === "GET" && pathname === `/orders/${sampleOrder.id}`) {
      return fulfillJson(route, 200, sampleOrder);
    }

    if (method === "POST" && pathname === "/orders/quote") {
      return fulfillJson(route, 200, {
        distanceMeters: 5200,
        durationSeconds: 1200,
        estimatedCo2Saved: 0.0625,
        polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
        shippingFee: 42500,
      });
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

    if (method === "POST" && pathname === `/payments/create-intent/${sampleOrder.id}`) {
      return fulfillJson(route, 200, {
        amount: 13750,
        clientSecret: "pi_mock_secret_checkout",
        transactionId: "txn-mock-checkout",
      });
    }

    if (method === "GET" && pathname === `/payments/order/${sampleOrder.id}`) {
      return fulfillJson(route, 200, {
        amount: 137.5,
        method: "STRIPE",
        orderId: sampleOrder.id,
        paidAt: null,
        status: "PENDING",
        transactionId: "txn-mock-checkout",
      });
    }

    if (method === "GET" && pathname === "/maps/places/autocomplete") {
      const input = url.searchParams.get("input") ?? "";
      return fulfillJson(route, 200, {
        predictions: [
          {
            description: input.includes("123")
              ? "123 Nguyễn Văn Linh, Quận 7"
              : "456 Điện Biên Phủ, Bình Thạnh",
            place_id: input.includes("123") ? "pickup-place" : "delivery-place",
            structured_formatting: {
              main_text: input.includes("123")
                ? "123 Nguyễn Văn Linh"
                : "456 Điện Biên Phủ",
              secondary_text: input.includes("123")
                ? "Quận 7, TP HCM"
                : "Bình Thạnh, TP HCM",
            },
          },
        ],
      });
    }

    if (method === "GET" && pathname === "/maps/places/detail") {
      const placeId =
        url.searchParams.get("placeId") ?? url.searchParams.get("placeid");
      return fulfillJson(route, 200, {
        result: {
          formatted_address:
            placeId === "pickup-place"
              ? "123 Nguyễn Văn Linh, Quận 7"
              : "456 Điện Biên Phủ, Bình Thạnh",
          geometry: {
            location: {
              lat: placeId === "pickup-place" ? 10.728851 : 10.80035,
              lng: placeId === "pickup-place" ? 106.721659 : 106.71482,
            },
          },
          place_id: placeId,
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

    if (method === "GET" && pathname === "/analytics/orders") {
      return fulfillJson(route, 200, sampleOrderAnalytics);
    }

    if (method === "GET" && pathname === "/analytics/emissions") {
      return fulfillJson(route, 200, sampleEmissionAnalytics);
    }

    return fulfillJson(route, 404, {
      message: `Unhandled mock route: ${method} ${pathname}`,
    });
  });
}

export async function seedAuthenticatedSession(
  page: Page,
  role: "admin" | "customer" = "customer",
) {
  const accessToken = createMockAccessToken(role);
  seededAccessTokens.set(page, accessToken);

  await page.context().addCookies([
    {
      name: accessTokenKey,
      value: accessToken,
      url: appBaseUrl,
    },
    {
      name: refreshTokenKey,
      value: "mock-refresh-token",
      url: appBaseUrl,
    },
  ]);
  await page.addInitScript(
    ({ accessToken, accessTokenKey, refreshTokenKey }) => {
      window.localStorage.setItem(accessTokenKey, accessToken);
      window.localStorage.setItem(refreshTokenKey, "mock-refresh-token");
    },
    { accessToken, accessTokenKey, refreshTokenKey },
  );
}
