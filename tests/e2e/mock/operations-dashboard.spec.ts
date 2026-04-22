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

  const submitButton = page.getByRole("button", {
    name: "Tạo đơn hàng và tiếp tục",
  });

  await expect(submitButton).toBeDisabled();

  await page.getByRole("textbox", { name: "Khách hàng" }).fill("Công ty Emerald");
  await page.getByRole("textbox", { name: "Tên liên hệ" }).fill("Nguyen Van A");
  await page.getByRole("textbox", { name: "Số điện thoại liên hệ" }).fill("0901234567");
  await page.getByRole("textbox", { name: "Tên người nhận" }).fill("Tran Thi B");
  await page.getByRole("textbox", { name: "Số điện thoại người nhận" }).fill("0912345678");
  await page.getByRole("spinbutton", { name: "Khối lượng (kg)" }).fill("25");
  await page
    .getByRole("textbox", { name: "Địa chỉ lấy hàng" })
    .fill("123 Nguyễn Văn Linh");
  await page.getByRole("button", { name: /123 Nguyễn Văn Linh/i }).click();
  await page
    .getByRole("textbox", { name: "Địa chỉ giao hàng" })
    .fill("456 Điện Biên Phủ");
  await page.getByRole("button", { name: /456 Điện Biên Phủ/i }).click();

  await expect(page.getByText("Đã chốt tọa độ")).toHaveCount(2);
  await expect(page.getByText("Đã nhận báo giá")).toBeVisible();
  await expect(submitButton).toBeEnabled();

  await submitButton.click();

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
  await expect(page.getByText("ELG-2026-0001").first()).toBeVisible();

  await page.goto("/dashboard/admin/analytics");
  await expect(page.getByText("Hiệu suất Đội xe")).toBeVisible();
  await expect(page.getByText("Xe 51A-12345")).toBeVisible();

  await seedAuthenticatedSession(page, "customer");
  await page.goto("/orders");
  await expect(page.getByText("Lịch sử Đơn hàng")).toBeVisible();
  await expect(page.getByText("ELG-2026-0001")).toBeVisible();
});
