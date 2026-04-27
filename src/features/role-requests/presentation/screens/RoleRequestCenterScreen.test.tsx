import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { renderWithProviders } from "@/test/render";
import RoleRequestCenterScreen from "./RoleRequestCenterScreen";

const useMyRoleRequestsQueryMock = vi.fn();

vi.mock("@/features/auth/presentation/hooks/useAuthSession", () => ({
  useAuthSession: () => ({
    user: {
      role: "customer",
    },
  }),
}));

vi.mock("@/features/role-requests/presentation/hooks/useRoleRequests", () => ({
  useCreateRoleRequest: () => ({
    error: null,
    isPending: false,
    mutateAsync: vi.fn(),
  }),
  useMyRoleRequestsQuery: (...args: unknown[]) => useMyRoleRequestsQueryMock(...args),
}));

describe("RoleRequestCenterScreen", () => {
  beforeEach(() => {
    useMyRoleRequestsQueryMock.mockReset();
    useMyRoleRequestsQueryMock.mockReturnValue({
      data: {
        data: [
          {
            id: "88",
            targetRoleLabel: "Driver",
            targetRoleName: "DRIVER",
            status: "PENDING",
            reason: "Tôi muốn làm tài xế.",
            createdAt: "2026-04-20T09:00:00.000Z",
            reviewerName: null,
            reviewNote: null,
          },
        ],
        totalItems: 1,
      },
      isError: false,
      isPending: false,
    });
  });

  it("disables submit when there is already a pending request", () => {
    renderWithProviders(<RoleRequestCenterScreen />);

    expect(
      screen.getByText(
        "Bạn đang có một yêu cầu chờ duyệt. Hãy đợi quản trị viên xử lý trước khi gửi yêu cầu mới.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gửi yêu cầu" })).toBeDisabled();
  });

  it("hides raw backend details when role request history cannot be loaded", () => {
    useMyRoleRequestsQueryMock.mockReturnValue({
      error: new ApiError({
        message:
          "Invalid `prisma.roleRequest.findMany()` invocation: The table `public.role_requests` does not exist in the current database.",
        status: 500,
      }),
      isError: true,
      isPending: false,
    });

    renderWithProviders(<RoleRequestCenterScreen />);

    expect(screen.getByText("Không thể tải yêu cầu vai trò")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Dịch vụ yêu cầu vai trò đang tạm thời gián đoạn. Vui lòng thử lại sau hoặc liên hệ quản trị viên nếu lỗi kéo dài.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Invalid `prisma\.roleRequest\.findMany\(\)` invocation/i),
    ).not.toBeInTheDocument();
  });
});
