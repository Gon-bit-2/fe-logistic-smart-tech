import type {
  AddressBookEntryDto,
  AddressBookListResponse,
  AddressBookUpsertInput,
  AuthLoginInput,
  AuthProfileDto,
  ForgotPasswordInput,
  GoogleLoginLinkResponse,
  MessageResponse,
  RegisterWithOtpInput,
  RequestRegisterOtpInput,
  UpdateAuthProfileInput,
  VerificationCodeType,
} from "@/features/auth/domain/types/auth.types";
import { httpClient } from "@/lib/api/http-client";
import { ApiError } from "@/lib/api/errors";
import type { SessionTokens } from "@/types/common.type";

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function requestSessionRoute<T>(input: RequestInfo | URL, init: RequestInit) {
  const response = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    throw new ApiError({
      details: payload,
      message:
        typeof payload === "object" &&
        payload !== null &&
        "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : "Request failed",
      status: response.status,
    });
  }

  return payload as T;
}

async function requestOtp(email: string, type: VerificationCodeType) {
  const response = await httpClient.post<MessageResponse>("/auth/otp", {
    email,
    type,
  });

  return response.data;
}

export async function requestRegisterOtp(input: RequestRegisterOtpInput) {
  return requestOtp(input.email, "REGISTER");
}

export async function requestForgotPasswordOtp(email: string) {
  return requestOtp(email, "FORGOT_PASSWORD");
}

export async function registerWithOtp(input: RegisterWithOtpInput) {
  const response = await httpClient.post("/auth/register", {
    code: input.code,
    confirmPassword: input.password,
    email: input.email,
    fullName: input.fullName,
    password: input.password,
    phone: input.phone,
  });

  return response.data;
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const response = await httpClient.post<MessageResponse>(
    "/auth/forgot-password",
    {
      code: input.code,
      confirmPassword: input.confirmPassword,
      email: input.email,
      password: input.password,
    },
  );

  return response.data;
}

export async function login(input: AuthLoginInput) {
  return requestSessionRoute<SessionTokens>("/api/auth/session/login", {
    body: JSON.stringify(input),
    method: "POST",
  });
}

export async function getProfile() {
  const response = await httpClient.get<AuthProfileDto>("/auth/profile");
  return response.data;
}

export async function updateProfile(input: UpdateAuthProfileInput) {
  const response = await httpClient.patch<AuthProfileDto>("/auth/profile", input);
  return response.data;
}

export async function getAddressBook() {
  const response = await httpClient.get<AddressBookListResponse>("/auth/address-book");
  return response.data;
}

export async function createAddressBook(input: AddressBookUpsertInput) {
  const response = await httpClient.post<AddressBookEntryDto>("/auth/address-book", input);
  return response.data;
}

export async function updateAddressBook(id: number, input: AddressBookUpsertInput) {
  const response = await httpClient.patch<AddressBookEntryDto>(`/auth/address-book/${id}`, input);
  return response.data;
}

export async function deleteAddressBook(id: number) {
  const response = await httpClient.delete<MessageResponse>(`/auth/address-book/${id}`);
  return response.data;
}

export async function logout() {
  return requestSessionRoute<MessageResponse>("/api/auth/session", {
    method: "DELETE",
  });
}

export async function getGoogleLoginLink() {
  const response = await httpClient.get<GoogleLoginLinkResponse>(
    "/auth/google-link",
    {
      skipAuthRefresh: true,
    },
  );

  return response.data;
}

export async function exchangeGoogleSession(sessionToken: string) {
  return requestSessionRoute<SessionTokens>("/api/auth/session/google", {
    body: JSON.stringify({ sessionToken }),
    method: "POST",
  });
}
