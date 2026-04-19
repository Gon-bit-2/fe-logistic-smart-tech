import { expect, test } from "@playwright/test";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8386";

test("backend health endpoint is reachable", async ({ request }) => {
  const response = await request.get(`${backendBaseUrl}/`);
  expect(response.ok()).toBeTruthy();
});

test("public landing and tracking pages render against the real app", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Tương lai của logistics là/i })).toBeVisible();

  await page.goto("/tracking");
  await expect(page.getByText("Theo dõi hành trình đơn hàng")).toBeVisible();
});

test("public tracking detail smoke test runs when a tracking code is provided", async ({
  page,
}) => {
  test.skip(
    !process.env.E2E_TRACKING_CODE,
    "Set E2E_TRACKING_CODE to run the live tracking detail smoke test.",
  );

  await page.goto(`/tracking/${process.env.E2E_TRACKING_CODE}`);
  await expect(page.getByText("Mã theo dõi")).toBeVisible();
});
