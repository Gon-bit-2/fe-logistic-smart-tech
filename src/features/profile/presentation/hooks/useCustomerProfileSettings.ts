"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toAuthProfile } from "@/features/auth/application/services/auth-session";
import type {
  AddressBookEntryDto,
  AddressBookUpsertInput,
  AuthProfile,
} from "@/features/auth/domain/types/auth.types";
import {
  createAddressBook,
  deleteAddressBook,
  getAddressBook,
  updateAddressBook,
  updateProfile,
} from "@/features/auth/infrastructure/api/auth.api";
import {
  authProfileQueryKey,
  useAuthProfileQuery,
} from "@/features/auth/presentation/hooks/useAuthProfileQuery";
import type {
  AddressBookDraftInput,
  AddressBookEntry,
  MergedCustomerProfile,
  ProfileSaveState,
  UserProfileDraft,
} from "@/features/profile/domain/types/profile.types";
import { ApiError } from "@/lib/api/errors";

const addressBookQueryKey = ["auth", "address-book"] as const;

type ProfileFormErrors = {
  fullName: string | null;
  phone: string | null;
};

function toProfileDraft(profile: AuthProfile): UserProfileDraft {
  return {
    fullName: profile.fullName,
    phone: profile.phone ?? "",
  };
}

function toMergedProfile(
  profile: AuthProfile,
  draft: UserProfileDraft | null,
): MergedCustomerProfile {
  return {
    ...profile,
    fullName: draft?.fullName ?? profile.fullName,
    phone: draft?.phone ?? profile.phone ?? "",
  };
}

function mapAddressEntry(dto: AddressBookEntryDto): AddressBookEntry {
  return {
    address: dto.address,
    contactName: dto.contactName,
    createdAt: dto.createdAt,
    id: dto.id,
    isDefault: dto.isDefault,
    label: dto.label?.trim() || "Địa chỉ giao nhận",
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    phone: dto.phone,
    updatedAt: dto.updatedAt,
  };
}

function toAddressPayload(input: AddressBookDraftInput): AddressBookUpsertInput {
  return {
    address: input.address.trim(),
    contactName: input.contactName.trim(),
    isDefault: input.isDefault,
    label: input.label.trim() || undefined,
    latitude: input.latitude,
    longitude: input.longitude,
    phone: normalizePhone(input.phone),
  };
}

function normalizePhone(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function validateProfileDraft(draft: UserProfileDraft): ProfileFormErrors {
  const normalizedPhone = normalizePhone(draft.phone);

  return {
    fullName:
      draft.fullName.trim().length >= 2 ? null : "Vui lòng nhập tên hiển thị hợp lệ.",
    phone:
      normalizedPhone.length === 0 || /^[0-9]{9,15}$/.test(normalizedPhone)
        ? null
        : "Số điện thoại chỉ nên gồm 9-15 chữ số.",
  };
}

export function createEmptyAddressDraft(): AddressBookDraftInput {
  return {
    address: "",
    contactName: "",
    isDefault: false,
    label: "",
    phone: "",
  };
}

export function validateAddressDraft(input: AddressBookDraftInput) {
  const normalizedPhone = normalizePhone(input.phone);

  return {
    address: input.address.trim() ? null : "Vui lòng nhập địa chỉ chi tiết.",
    contactName: input.contactName.trim() ? null : "Vui lòng nhập tên người liên hệ.",
    label: input.label.trim() ? null : "Tên địa chỉ là bắt buộc.",
    phone:
      /^[0-9]{9,15}$/.test(normalizedPhone)
        ? null
        : "Số điện thoại địa chỉ không hợp lệ.",
  };
}

export function useCustomerProfileSettings() {
  const queryClient = useQueryClient();
  const profileQuery = useAuthProfileQuery();
  const addressesQuery = useQuery<AddressBookEntry[], ApiError>({
    enabled: Boolean(profileQuery.data),
    queryFn: async () => {
      const response = await getAddressBook();
      return response.data.map(mapAddressEntry);
    },
    queryKey: addressBookQueryKey,
    staleTime: 60_000,
  });

  const [form, setForm] = useState<UserProfileDraft>({ fullName: "", phone: "" });
  const [loadedUserId, setLoadedUserId] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<ProfileSaveState>("idle");

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    if (loadedUserId === profileQuery.data.id) {
      return;
    }

    setForm(toProfileDraft(profileQuery.data));
    setSaveState("idle");
    setLoadedUserId(profileQuery.data.id);
  }, [loadedUserId, profileQuery.data]);

  const sourceDraft = useMemo(
    () => (profileQuery.data ? toProfileDraft(profileQuery.data) : null),
    [profileQuery.data],
  );
  const activeForm = useMemo(
    () =>
      loadedUserId === profileQuery.data?.id && sourceDraft
        ? form
        : (sourceDraft ?? form),
    [form, loadedUserId, profileQuery.data?.id, sourceDraft],
  );
  const formErrors = useMemo(() => validateProfileDraft(activeForm), [activeForm]);
  const profile = useMemo(() => {
    if (!profileQuery.data) {
      return null;
    }

    return toMergedProfile(profileQuery.data, activeForm);
  }, [activeForm, profileQuery.data]);
  const addresses = addressesQuery.data ?? [];
  const isValid = !formErrors.fullName && !formErrors.phone;
  const isDirty = Boolean(
    sourceDraft &&
      (sourceDraft.fullName !== activeForm.fullName ||
        normalizePhone(sourceDraft.phone) !== normalizePhone(activeForm.phone)),
  );

  const updateProfileMutation = useMutation<AuthProfile, ApiError, UserProfileDraft>({
    mutationFn: async (draft) =>
      toAuthProfile(
        await updateProfile({
          fullName: draft.fullName.trim(),
          phone: normalizePhone(draft.phone),
        }),
      ),
    onMutate: () => {
      setSaveState("saving");
    },
    onSuccess: (nextProfile) => {
      queryClient.setQueryData(authProfileQueryKey, nextProfile);
      setForm(toProfileDraft(nextProfile));
      setLoadedUserId(nextProfile.id);
      setSaveState("saved");
    },
    onError: () => {
      setSaveState("dirty");
    },
  });

  const addressUpsertMutation = useMutation<
    AddressBookEntryDto,
    ApiError,
    AddressBookDraftInput
  >({
    mutationFn: async (draft) => {
      const payload = toAddressPayload(draft);
      return draft.id
        ? updateAddressBook(draft.id, payload)
        : createAddressBook(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressBookQueryKey });
    },
  });

  const addressDeleteMutation = useMutation<{ message: string }, ApiError, number>({
    mutationFn: deleteAddressBook,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressBookQueryKey });
    },
  });

  const addressDefaultMutation = useMutation<AddressBookEntryDto, ApiError, number>({
    mutationFn: async (addressId) => updateAddressBook(addressId, { isDefault: true }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressBookQueryKey });
    },
  });

  function updateField<Key extends keyof UserProfileDraft>(
    key: Key,
    value: UserProfileDraft[Key],
  ) {
    if (profileQuery.data && loadedUserId !== profileQuery.data.id) {
      setLoadedUserId(profileQuery.data.id);
    }

    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setSaveState("dirty");
  }

  async function saveProfileDraft() {
    if (!profileQuery.data || !isValid || updateProfileMutation.isPending) {
      return false;
    }

    await updateProfileMutation.mutateAsync(activeForm);
    return true;
  }

  function resetProfileDraft() {
    if (!profileQuery.data) {
      return;
    }

    setForm(toProfileDraft(profileQuery.data));
    setSaveState("idle");
  }

  async function saveAddress(input: AddressBookDraftInput) {
    const validation = validateAddressDraft(input);

    if (Object.values(validation).some(Boolean) || addressUpsertMutation.isPending) {
      return false;
    }

    await addressUpsertMutation.mutateAsync(input);
    return true;
  }

  async function deleteAddress(addressId: number) {
    if (addressDeleteMutation.isPending) {
      return;
    }

    await addressDeleteMutation.mutateAsync(addressId);
  }

  async function setDefaultAddress(addressId: number) {
    if (addressDefaultMutation.isPending) {
      return;
    }

    await addressDefaultMutation.mutateAsync(addressId);
  }

  return {
    addresses,
    addressesQuery,
    deleteAddress,
    form: activeForm,
    formErrors,
    isAddressMutating:
      addressUpsertMutation.isPending ||
      addressDeleteMutation.isPending ||
      addressDefaultMutation.isPending,
    isDirty,
    isSavingProfile: updateProfileMutation.isPending,
    isValid,
    profile,
    profileQuery,
    resetProfileDraft,
    saveAddress,
    saveProfileDraft,
    saveState,
    setDefaultAddress,
    updateField,
  };
}
