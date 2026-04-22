import type { UserRole } from "@/features/auth/domain/types/auth.types";

export type UserProfileDraft = {
  fullName: string;
  phone: string;
};

export type AddressBookEntry = {
  address: string;
  contactName: string;
  createdAt: string;
  id: number;
  isDefault: boolean;
  label: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  updatedAt: string;
};

export type AddressBookDraftInput = {
  address: string;
  contactName: string;
  id?: number;
  isDefault: boolean;
  label: string;
  latitude?: number;
  longitude?: number;
  phone: string;
};

export type MergedCustomerProfile = {
  avatarUrl: string | null;
  email: string;
  fullName: string;
  hubId: number | null;
  id: number;
  initials: string;
  phone: string;
  role: UserRole;
  roleId: number;
};

export type ProfileSaveState = "idle" | "dirty" | "saving" | "saved";
