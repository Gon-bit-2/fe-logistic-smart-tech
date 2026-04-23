export type AuthFormMode = "login" | "register";

export type AuthStatus = "anonymous" | "authenticated";

export type VerificationCodeType = "FORGOT_PASSWORD" | "LOGIN" | "REGISTER";

export type UserRole = "admin" | "customer" | "driver" | "warehouse_staff";

export type AuthLoginInput = {
  email: string;
  password: string;
};

export type RegisterDraft = {
  email: string;
  fullName: string;
  organization?: string;
  password: string;
  phone?: string;
};

export type ForgotPasswordDraft = {
  confirmPassword: string;
  email: string;
  password: string;
};

export type OtpChallengeMeta = {
  channel: "email";
  destination: string;
  expiresAt: string;
  maskedDestination: string;
  type: VerificationCodeType;
};

export type RequestRegisterOtpInput = RegisterDraft;

export type RegisterWithOtpInput = RegisterDraft & {
  code: string;
};

export type RequestForgotPasswordOtpInput = ForgotPasswordDraft;

export type ForgotPasswordInput = ForgotPasswordDraft & {
  code: string;
};

export type GoogleLoginLinkResponse = {
  url: string;
};

export type GoogleCallbackParams = {
  errorMessage: string | null;
  sessionToken: string | null;
};

export type MessageResponse = {
  message: string;
};

export type UpdateAuthProfileInput = {
  avatar?: string | null;
  fullName?: string;
  phone?: string;
};

export const ROLE_ID_MAP: Record<number, UserRole> = {
  1: "admin",
  2: "customer",
  3: "driver",
  4: "warehouse_staff",
};

export type AccessTokenPayload = {
  deviceId: number;
  exp: number;
  iat: number;
  roleId: number;
  roleName: string;
  userId: number;
};

export type AuthUser = {
  id: number;
  role: UserRole;
  roleId: number;
};

export type AuthProfileDto = {
  avatar?: string | null;
  avatarUrl?: string | null;
  email: string;
  fullName?: string | null;
  hubId?: number | null;
  id: number;
  phone?: string | null;
  roleId: number;
  roleName?: string | null;
};

export type AddressBookEntryDto = {
  address: string;
  contactName: string;
  createdAt: string;
  deletedAt?: string | null;
  id: number;
  isDefault: boolean;
  label?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone: string;
  updatedAt: string;
  userId: number;
};

export type AddressBookListResponse = {
  data: AddressBookEntryDto[];
};

export type AddressBookUpsertInput = {
  address?: string;
  contactName?: string;
  isDefault?: boolean;
  label?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
};

export type AuthProfile = {
  avatarUrl: string | null;
  email: string;
  fullName: string;
  hubId: number | null;
  id: number;
  initials: string;
  phone: string | null;
  role: UserRole;
  roleId: number;
};
