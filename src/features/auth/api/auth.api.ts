import type {
  AuthLoginInput,
  RegisterWithOtpInput,
  RequestRegisterOtpInput,
} from "@/features/auth/types/auth.types";
import { httpClient } from "@/lib/api/http-client";
import type { SessionTokens } from "@/types/common.type";

type MessageResponse = {
  message: string;
};

type GoogleLinkResponse = {
  url: string;
};

export async function requestRegisterOtp(input: RequestRegisterOtpInput) {
  const response = await httpClient.post<MessageResponse>("/auth/otp", {
    email: input.email,
    type: "REGISTER",
  });

  return response.data;
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

export async function login(input: AuthLoginInput) {
  const response = await httpClient.post<SessionTokens>("/auth/login", input);
  return response.data;
}

export async function logout(refreshToken: string) {
  const response = await httpClient.post<MessageResponse>("/auth/logout", {
    refreshToken,
  });

  return response.data;
}

export async function getGoogleLoginLink() {
  const response = await httpClient.get<GoogleLinkResponse>("/auth/google-link", {
    skipAuthRefresh: true,
  });

  return response.data;
}
