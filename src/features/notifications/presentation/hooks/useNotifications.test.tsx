import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "@/test/render";
import { notificationKeys } from "@/features/notifications/presentation/state/notification.query-keys";
import { useMarkAllNotificationsRead, useMarkNotificationRead } from "./useNotifications";

const {
  markAllNotificationsReadUseCase,
  markNotificationReadUseCase,
} = vi.hoisted(() => ({
  markAllNotificationsReadUseCase: vi.fn(),
  markNotificationReadUseCase: vi.fn(),
}));

vi.mock("@/features/notifications/application/use-cases/notification.use-cases", () => ({
  getUnreadNotificationsCountUseCase: vi.fn(),
  listNotificationsUseCase: vi.fn(),
  markAllNotificationsReadUseCase,
  markNotificationReadUseCase,
}));

describe("useNotifications mutations", () => {
  beforeEach(() => {
    markNotificationReadUseCase.mockReset();
    markAllNotificationsReadUseCase.mockReset();
  });

  it("invalidates notification queries after marking one item as read", async () => {
    markNotificationReadUseCase.mockResolvedValue({ message: "ok" });

    const { result, queryClient } = renderHookWithProviders(() =>
      useMarkNotificationRead(),
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await act(async () => {
      await result.current.mutateAsync("12");
    });

    expect(markNotificationReadUseCase).toHaveBeenCalled();
    expect(markNotificationReadUseCase.mock.calls[0][0]).toBe("12");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationKeys.all,
    });
  });

  it("invalidates notification queries after marking all items as read", async () => {
    markAllNotificationsReadUseCase.mockResolvedValue({ message: "ok" });

    const { result, queryClient } = renderHookWithProviders(() =>
      useMarkAllNotificationsRead(),
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(markAllNotificationsReadUseCase).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationKeys.all,
    });
  });
});
