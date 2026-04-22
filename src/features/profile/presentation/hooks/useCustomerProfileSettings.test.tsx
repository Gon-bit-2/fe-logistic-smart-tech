"use client";

import { act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "@/test/render";
import { useCustomerProfileSettings } from "@/features/profile/presentation/hooks/useCustomerProfileSettings";

const getProfileMock = vi.fn();
const updateProfileMock = vi.fn();
const getAddressBookMock = vi.fn();
const createAddressBookMock = vi.fn();
const updateAddressBookMock = vi.fn();
const deleteAddressBookMock = vi.fn();

vi.mock("@/features/auth/infrastructure/api/auth.api", () => ({
  getProfile: () => getProfileMock(),
  updateProfile: (input: unknown) => updateProfileMock(input),
  getAddressBook: () => getAddressBookMock(),
  createAddressBook: (input: unknown) => createAddressBookMock(input),
  updateAddressBook: (id: number, input: unknown) => updateAddressBookMock(id, input),
  deleteAddressBook: (id: number) => deleteAddressBookMock(id),
}));

const sampleProfileDto = {
  avatar: null,
  email: "customer@emerald.vn",
  fullName: "Cong ty Emerald",
  hubId: 14,
  id: 7,
  phone: "0900111222",
  roleId: 2,
  roleName: "customer",
};

describe("useCustomerProfileSettings", () => {
  beforeEach(() => {
    getProfileMock.mockReset();
    updateProfileMock.mockReset();
    getAddressBookMock.mockReset();
    createAddressBookMock.mockReset();
    updateAddressBookMock.mockReset();
    deleteAddressBookMock.mockReset();
  });

  it("loads profile and address book from API", async () => {
    getProfileMock.mockResolvedValue(sampleProfileDto);
    getAddressBookMock.mockResolvedValue({
      data: [
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
          userId: 7,
        },
      ],
    });

    const { result } = renderHookWithProviders(() => useCustomerProfileSettings());

    await waitFor(() => expect(result.current.profile?.email).toBe("customer@emerald.vn"));
    await waitFor(() => expect(result.current.addresses).toHaveLength(1));

    expect(result.current.profile?.fullName).toBe("Cong ty Emerald");
    expect(result.current.addresses[0]?.address).toBe("123 Nguyen Van Linh, Quan 7");
  });

  it("updates profile through PATCH /auth/profile", async () => {
    getProfileMock.mockResolvedValue(sampleProfileDto);
    getAddressBookMock.mockResolvedValue({ data: [] });
    updateProfileMock.mockResolvedValue({
      ...sampleProfileDto,
      fullName: "Cong ty Emerald Sai Gon",
      phone: "0988777666",
    });

    const { result } = renderHookWithProviders(() => useCustomerProfileSettings());

    await waitFor(() => expect(result.current.profile?.fullName).toBe("Cong ty Emerald"));

    act(() => {
      result.current.updateField("fullName", "Cong ty Emerald Sai Gon");
      result.current.updateField("phone", "0988 777 666");
    });

    expect(result.current.isDirty).toBe(true);

    await act(async () => {
      await result.current.saveProfileDraft();
    });

    expect(updateProfileMock).toHaveBeenCalledWith({
      fullName: "Cong ty Emerald Sai Gon",
      phone: "0988777666",
    });

    await waitFor(() => expect(result.current.profile?.fullName).toBe("Cong ty Emerald Sai Gon"));
    expect(result.current.saveState).toBe("saved");
  });

  it("creates an address through POST /auth/address-book", async () => {
    getProfileMock.mockResolvedValue(sampleProfileDto);
    getAddressBookMock
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          {
            address: "456 Dien Bien Phu, Binh Thanh",
            contactName: "Chi Lan",
            createdAt: "2026-04-22T00:00:00.000Z",
            id: 33,
            isDefault: true,
            label: "Van phong",
            latitude: null,
            longitude: null,
            phone: "0988777666",
            updatedAt: "2026-04-22T00:00:00.000Z",
            userId: 7,
          },
        ],
      });
    createAddressBookMock.mockResolvedValue({
      address: "456 Dien Bien Phu, Binh Thanh",
      contactName: "Chi Lan",
      createdAt: "2026-04-22T00:00:00.000Z",
      id: 33,
      isDefault: true,
      label: "Van phong",
      latitude: null,
      longitude: null,
      phone: "0988777666",
      updatedAt: "2026-04-22T00:00:00.000Z",
      userId: 7,
    });

    const { result } = renderHookWithProviders(() => useCustomerProfileSettings());

    await waitFor(() => expect(result.current.profile?.id).toBe(7));

    await act(async () => {
      await result.current.saveAddress({
        address: "456 Dien Bien Phu, Binh Thanh",
        contactName: "Chi Lan",
        isDefault: true,
        label: "Van phong",
        phone: "0988777666",
      });
    });

    expect(createAddressBookMock).toHaveBeenCalledWith({
      address: "456 Dien Bien Phu, Binh Thanh",
      contactName: "Chi Lan",
      isDefault: true,
      label: "Van phong",
      latitude: undefined,
      longitude: undefined,
      phone: "0988777666",
    });

    await waitFor(() => expect(result.current.addresses).toHaveLength(1));
    expect(result.current.addresses[0]?.label).toBe("Van phong");
  });
});
