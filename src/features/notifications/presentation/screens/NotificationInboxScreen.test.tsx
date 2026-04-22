import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { renderWithProviders } from "@/test/render";
import NotificationInboxScreen from "./NotificationInboxScreen";

const markNotificationRead = vi.fn();
const markAllNotificationsRead = vi.fn();
const useNotificationsQueryMock = vi.fn();

vi.mock("@/features/auth/presentation/hooks/useAuthSession", () => ({
  useAuthSession: () => ({
    user: {
      role: "customer",
    },
  }),
}));

vi.mock("@/features/notifications/presentation/hooks/useNotifications", () => ({
  useMarkAllNotificationsRead: () => ({
    isPending: false,
    mutateAsync: markAllNotificationsRead,
  }),
  useMarkNotificationRead: () => ({
    isPending: false,
    mutateAsync: markNotificationRead,
  }),
  useNotificationsQuery: (...args: unknown[]) => useNotificationsQueryMock(...args),
}));

describe("NotificationInboxScreen", () => {
  beforeEach(() => {
    markNotificationRead.mockReset();
    markAllNotificationsRead.mockReset();
    useNotificationsQueryMock.mockReset();
    useNotificationsQueryMock.mockReturnValue({
      data: {
        data: [
          {
            id: "12",
            title: "Cập nhật role request",
            content: "Yêu cầu của bạn đang chờ duyệt.",
            createdAt: "2026-04-20T09:00:00.000Z",
            isRead: false,
            ctaHref: "/role-requests",
            ctaLabel: "Mở trung tâm role",
          },
        ],
        totalItems: 1,
      },
      isError: false,
      isPending: false,
    });
  });

  it("renders notifications and marks one item as read", () => {
    renderWithProviders(<NotificationInboxScreen />);

    expect(screen.getByText("Cập nhật role request")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mở trung tâm role" })).toHaveAttribute(
      "href",
      "/role-requests",
    );

    fireEvent.click(screen.getByRole("button", { name: "Đánh dấu đã đọc" }));

    expect(markNotificationRead).toHaveBeenCalledWith("12");
  });

  it("hides raw backend details when notification loading fails", () => {
    useNotificationsQueryMock.mockReturnValue({
      error: new ApiError({
        message:
          "Invalid `prisma.notification.count()` invocation: The table `public.notifications` does not exist in the current database.",
        status: 500,
      }),
      isError: true,
      isPending: false,
    });

    renderWithProviders(<NotificationInboxScreen />);

    expect(screen.getByText("Không thể tải notifications")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Dịch vụ thông báo đang tạm thời gián đoạn. Vui lòng thử lại sau hoặc liên hệ quản trị viên nếu lỗi kéo dài.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Invalid `prisma\.notification\.count\(\)` invocation/i),
    ).not.toBeInTheDocument();
  });
});
