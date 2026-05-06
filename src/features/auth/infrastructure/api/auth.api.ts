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
import {
  API_AUTH_OTP,
  API_AUTH_REGISTER,
  API_AUTH_FORGOT_PASSWORD,
  API_SESSION_LOGIN,
  API_AUTH_PROFILE,
  API_AUTH_ADDRESS_BOOK,
  API_AUTH_ADDRESS_BOOK_DETAIL,
  API_SESSION_LOGOUT,
  API_AUTH_GOOGLE_LINK,
  API_SESSION_GOOGLE,
} from "@/utils/apiUrl";

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
  const response = await httpClient.post<MessageResponse>(API_AUTH_OTP, {
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
  const response = await httpClient.post(API_AUTH_REGISTER, {
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
    API_AUTH_FORGOT_PASSWORD,
    {
      code: input.code,
      confirmNewPassword: input.confirmPassword,
      email: input.email,
      newPassword: input.password,
    },
  );

  return response.data;
}

export async function login(input: AuthLoginInput) {
  return requestSessionRoute<SessionTokens>(API_SESSION_LOGIN, {
    body: JSON.stringify(input),
    method: "POST",
  });
}

export async function getProfile() {
  const response = await httpClient.get<AuthProfileDto>(API_AUTH_PROFILE);
  return response.data;
}

export async function updateProfile(input: UpdateAuthProfileInput) {
  const response = await httpClient.patch<AuthProfileDto>(API_AUTH_PROFILE, input);
  return response.data;
}

export async function getAddressBook() {
  const response = await httpClient.get<AddressBookListResponse>(API_AUTH_ADDRESS_BOOK);
  return response.data;
}

export async function createAddressBook(input: AddressBookUpsertInput) {
  const response = await httpClient.post<AddressBookEntryDto>(API_AUTH_ADDRESS_BOOK, input);
  return response.data;
}

export async function updateAddressBook(id: number, input: AddressBookUpsertInput) {
  const response = await httpClient.patch<AddressBookEntryDto>(API_AUTH_ADDRESS_BOOK_DETAIL(id), input);
  return response.data;
}

export async function deleteAddressBook(id: number) {
  const response = await httpClient.delete<MessageResponse>(API_AUTH_ADDRESS_BOOK_DETAIL(id));
  return response.data;
}

export async function logout() {
  return requestSessionRoute<MessageResponse>(API_SESSION_LOGOUT, {
    method: "DELETE",
  });
}

export async function getGoogleLoginLink() {
  const response = await httpClient.get<GoogleLoginLinkResponse>(
    API_AUTH_GOOGLE_LINK,
    {
      skipAuthRefresh: true,
    },
  );

  return response.data;
}

export async function exchangeGoogleSession(sessionToken: string) {
  return requestSessionRoute<SessionTokens>(API_SESSION_GOOGLE, {
    body: JSON.stringify({ sessionToken }),
    method: "POST",
  });
}
