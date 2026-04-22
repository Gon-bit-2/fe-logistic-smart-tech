import { expect, test } from "@playwright/test";
import { registerMockApiRoutes } from "./mock-api";

test.beforeEach(async ({ page }) => {
  await registerMockApiRoutes(page);
});

test("loads the landing page and uses operations navigation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Giải pháp Logistics Xanh & Thông minh/i }),
  ).toBeVisible();

  await page.goto("/tracking");
  await page.getByRole("link", { name: "Precision Logistics" }).click();

  await expect(page).toHaveURL(/\/$/);
});

test("logs in and redirects to order creation", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email tổ chức").fill("ops@emerald.com");
  await page.locator("input[type='password']").fill("Secret123");
  await page.getByRole("button", { name: "Truy cập hệ thống" }).click();

  await expect(page).toHaveURL(/\/dashboard\/customer$/);
  await expect(page.getByText("Tổng quan Khách hàng")).toBeVisible();
});

test("completes register and forgot-password OTP flows", async ({ page }) => {
  await page.goto("/auth/register");
  await page.getByPlaceholder("Nguyễn Văn A").fill("Nguyen Van A");
  await page.getByPlaceholder("Công ty Cổ phần ABC").fill("Emerald Ops");
  await page.getByPlaceholder("0900 111 222").fill("0909000000");
  await page.getByLabel("Email tổ chức").fill("register@emerald.com");
  await page.locator("input[type='password']").fill("Secret123");
  await page.getByRole("button", { name: "Đăng ký và tiếp tục" }).click();

  await expect(page).toHaveURL(/\/auth\/otp\?mode=register$/);
  for (let index = 0; index < 6; index += 1) {
    await page.getByLabel(`Chữ số OTP ${index + 1}`).fill("1");
  }
  await page.getByRole("button", { name: "Xác minh và hoàn tất" }).click();
  await expect(page).toHaveURL(/\/auth\/login$/);

  await page.goto("/auth/forgot-password");
  await page.getByLabel("Email tổ chức").fill("reset@emerald.com");
  await page.locator("input[type='password']").first().fill("NewSecret123");
  await page.locator("input[type='password']").nth(1).fill("NewSecret123");
  await page.getByRole("button", { name: "Gửi mã xác thực" }).click();

  await expect(page).toHaveURL(/\/auth\/otp\?mode=forgot-password$/);
  for (let index = 0; index < 6; index += 1) {
    await page.getByLabel(`Chữ số OTP ${index + 1}`).fill("2");
  }
  await page.getByRole("button", { name: "Xác minh và đặt lại mật khẩu" }).click();
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("tracks public shipments for success and not-found states", async ({ page }) => {
  await page.goto("/tracking");
  await page.getByPlaceholder("Nhập mã theo dõi").fill("ELG-2026-0001");
  await page.getByRole("button", { name: "Theo dõi đơn hàng" }).click();

  await expect(page).toHaveURL(/\/tracking\/ELG-2026-0001$/);
  await expect(page.getByText("Đang vận chuyển").first()).toBeVisible();

  await page.goto("/tracking");
  await page.getByPlaceholder("Nhập mã theo dõi").fill("MISSING");
  await page.getByRole("button", { name: "Theo dõi đơn hàng" }).click();

  await expect(page).toHaveURL(/\/tracking\/MISSING$/);
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy lô hàng công khai với mã theo dõi này",
    }),
  ).toBeVisible();
});
