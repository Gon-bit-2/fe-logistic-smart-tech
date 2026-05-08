import { expect, test } from "@playwright/test";
import { registerMockApiRoutes, seedAuthenticatedSession } from "./mock-api";

test.beforeEach(async ({ page }) => {
  await registerMockApiRoutes(page);
});

test("creates an order and opens localized checkout", async ({
  page,
}) => {
  await seedAuthenticatedSession(page, "customer");
  await page.goto("/vi/orders/create");

  const submitButton = page.getByRole("button", {
    name: "Tạo đơn hàng và tiếp tục",
  });

  await expect(submitButton).toBeDisabled();

  await page.getByRole("textbox", { name: "Tên liên hệ" }).fill("Nguyen Van A");
  await page.getByRole("textbox", { name: "Số điện thoại liên hệ" }).fill("0901234567");
  await page.getByRole("textbox", { name: "Tên người nhận" }).fill("Tran Thi B");
  await page.getByRole("textbox", { name: "Số điện thoại người nhận" }).fill("0912345678");
  await page.getByRole("spinbutton", { name: "Khối lượng (kg)" }).fill("25");
  await page.getByRole("textbox", { name: "Kích thước (cm)" }).fill("40x30x20");
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

  await expect(page).toHaveURL(/\/vi\/checkout\?orderId=ord-001$/);
  await expect(
    page.getByRole("heading", { name: "Thanh toán", exact: true }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Tóm tắt đơn hàng")).toBeVisible();
});

test("renders admin and customer dashboards with mocked backend data", async ({
  page,
}) => {
  await seedAuthenticatedSession(page, "admin");
  await page.goto("/vi/admin");
  await expect(page.getByText("Trung tâm điều hành vận hành thông minh")).toBeVisible();
  await expect(page.getByText("ELG-2026-0001").first()).toBeVisible();

  await page.goto("/vi/admin/analytics");
  await expect(page.getByText("Hiệu suất Đội xe")).toBeVisible();
  await expect(page.getByText("Xe 51A-12345")).toBeVisible();

  await seedAuthenticatedSession(page, "customer");
  await page.goto("/vi/orders");
  await expect(page.getByText("Lịch sử Đơn hàng")).toBeVisible();
  await expect(page.getByText("ELG-2026-0001")).toBeVisible();
});
