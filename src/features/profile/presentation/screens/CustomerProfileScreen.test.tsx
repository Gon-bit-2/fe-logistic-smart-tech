"use client";

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerProfileScreen from "@/features/profile/presentation/screens/CustomerProfileScreen";
import { renderWithProviders } from "@/test/render";
import { ApiError } from "@/lib/api/errors";

const useCustomerProfileSettingsMock = vi.fn();

vi.mock("@/features/profile/presentation/hooks/useCustomerProfileSettings", () => ({
  createEmptyAddressDraft: () => ({
    address: "",
    contactName: "",
    isDefault: false,
    label: "",
    phone: "",
  }),
  useCustomerProfileSettings: () => useCustomerProfileSettingsMock(),
  validateAddressDraft: () => ({
    address: null,
    contactName: null,
    label: null,
    phone: null,
  }),
}));

function createHookState(overrides: Record<string, unknown> = {}) {
  return {
    addresses: [],
    addressesQuery: {
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    },
    deleteAddress: vi.fn(),
    form: {
      fullName: "Cong ty Emerald",
      phone: "0900111222",
    },
    formErrors: {
      fullName: null,
      phone: null,
    },
    isAddressMutating: false,
    isDirty: false,
    isSavingProfile: false,
    isValid: true,
    profile: {
      avatarUrl: null,
      email: "customer@emerald.vn",
      fullName: "Cong ty Emerald",
      hubId: 14,
      id: 7,
      initials: "CE",
      phone: "0900111222",
      role: "customer",
      roleId: 2,
    },
    profileQuery: {
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    },
    resetProfileDraft: vi.fn(),
    saveAddress: vi.fn().mockResolvedValue(true),
    saveProfileDraft: vi.fn().mockResolvedValue(true),
    saveState: "idle",
    setDefaultAddress: vi.fn(),
    updateField: vi.fn(),
    ...overrides,
  };
}

function activateTab(name: string) {
  const tab = screen.getByRole("tab", { name });
  fireEvent.mouseDown(tab);
  fireEvent.click(tab);
}

describe("CustomerProfileScreen", () => {
  beforeEach(() => {
    useCustomerProfileSettingsMock.mockReset();
  });

  it("renders loading and error states from the hook", () => {
    useCustomerProfileSettingsMock.mockReturnValueOnce(
      createHookState({
        profile: null,
        profileQuery: {
          error: null,
          isError: false,
          isPending: true,
          refetch: vi.fn(),
        },
      }),
    );

    renderWithProviders(<CustomerProfileScreen />, {
      pathname: "/profile",
    });

    expect(screen.getByText("Đang tải hồ sơ khách hàng")).toBeInTheDocument();

    useCustomerProfileSettingsMock.mockReturnValueOnce(
      createHookState({
        profile: null,
        profileQuery: {
          error: new ApiError({ message: "forbidden", status: 403 }),
          isError: true,
          isPending: false,
          refetch: vi.fn(),
        },
      }),
    );

    renderWithProviders(<CustomerProfileScreen />, {
      pathname: "/profile",
    });

    expect(screen.getByText("Không thể tải hồ sơ")).toBeInTheDocument();
    expect(screen.getByText("Bạn không có quyền truy cập hồ sơ này.")).toBeInTheDocument();
  });

  it("renders account information with read-only email", () => {
    useCustomerProfileSettingsMock.mockReturnValue(createHookState());

    renderWithProviders(<CustomerProfileScreen />, {
      pathname: "/profile",
    });

    expect(screen.getByRole("heading", { name: "Hồ sơ & cài đặt" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Cong ty Emerald")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0900111222")).toBeInTheDocument();
    expect(screen.getByDisplayValue("customer@emerald.vn")).toBeDisabled();
    expect(screen.getByText("#7")).toBeInTheDocument();
    expect(screen.getByText("Hub #14")).toBeInTheDocument();
  });

  it("renders address book and CTA sections", () => {
    useCustomerProfileSettingsMock.mockReturnValue(
      createHookState({
        addresses: [
          {
            address: "123 Nguyen Van Linh, Quan 7",
            contactName: "Anh Tuan",
            createdAt: "2026-04-22T00:00:00.000Z",
            id: 21,
            isDefault: true,
            label: "Kho chinh",
            latitude: 10.77,
            longitude: 106.7,
            phone: "0911223344",
            updatedAt: "2026-04-22T00:00:00.000Z",
          },
        ],
        saveState: "saved",
      }),
    );

    renderWithProviders(<CustomerProfileScreen />, {
      pathname: "/profile",
    });

    activateTab("Danh bạ địa chỉ");
    expect(screen.getByText("Kho chinh")).toBeInTheDocument();
    expect(screen.getByText("Mặc định")).toBeInTheDocument();
    expect(screen.getByText("123 Nguyen Van Linh, Quan 7")).toBeInTheDocument();

    activateTab("Quyền & thông báo");
    expect(screen.getByRole("link", { name: "Mở inbox" })).toHaveAttribute(
      "href",
      "/overview?notifications=1",
    );
    expect(screen.getByRole("link", { name: "Mở role center" })).toHaveAttribute(
      "href",
      "/role-requests",
    );

    activateTab("Bảo mật");
    expect(screen.getByRole("link", { name: "Mở luồng bảo mật" })).toHaveAttribute(
      "href",
      "/auth/forgot-password",
    );
  });
});
