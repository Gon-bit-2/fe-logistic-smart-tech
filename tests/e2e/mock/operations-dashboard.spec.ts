import { expect, test } from "@playwright/test";
import { registerMockApiRoutes, seedAuthenticatedSession } from "./mock-api";

test.beforeEach(async ({ page }) => {
  await registerMockApiRoutes(page);
});

test("creates an order, confirms COD checkout, and lands on tracking detail", async ({
  page,
}) => {
  await seedAuthenticatedSession(page, "customer");
  await page.goto("/orders/create");

  await page.getByRole("textbox", { name: "Khách hàng" }).fill("Công ty Emerald");
  await page.getByRole("textbox", { name: "Địa chỉ lấy hàng" }).fill("123 Nguyễn Văn Linh");
  await page.getByRole("textbox", { name: "Địa chỉ giao hàng" }).fill("456 Điện Biên Phủ");
  await page.getByRole("spinbutton", { name: "Khối lượng (kg)" }).fill("25");
  await page.getByRole("button", { name: "Tạo đơn hàng và tiếp tục" }).click();

  await expect(page).toHaveURL(/\/checkout\?orderId=ord-001$/);
  await page.getByRole("button", { name: "Thanh toán khi nhận hàng" }).click();
  await page.getByRole("button", { name: "Xác nhận đơn COD" }).click();

  await expect(page).toHaveURL(/\/tracking\/ELG-2026-0001$/);
  await expect(page.getByText("Biên nhận giao hàng")).toBeVisible();
});

test("renders admin and customer dashboards with mocked backend data", async ({
  page,
}) => {
  await seedAuthenticatedSession(page, "admin");
  await page.goto("/dashboard/admin");
  await expect(page.getByText("Trung tâm điều hành vận hành thông minh")).toBeVisible();
  await expect(page.getByText("ELG-2026-0001")).toBeVisible();

  await page.goto("/dashboard/admin/analytics");
  await expect(page.getByText("Hiệu suất Đội xe")).toBeVisible();
  await expect(page.getByText("Xe 51A-12345")).toBeVisible();

  await seedAuthenticatedSession(page, "customer");
  await page.goto("/dashboard/customer/orders");
  await expect(page.getByText("Lịch sử Đơn hàng")).toBeVisible();
  await expect(page.getByText("ELG-2026-0001")).toBeVisible();
});
