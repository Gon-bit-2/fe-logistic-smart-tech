import type {
  AuthLoginInput,
  ForgotPasswordInput,
  GoogleLoginLinkResponse,
  MessageResponse,
  RegisterWithOtpInput,
  RequestRegisterOtpInput,
  VerificationCodeType,
} from "@/features/auth/domain/types/auth.types";
import { httpClient } from "@/lib/api/http-client";
import type { SessionTokens } from "@/types/common.type";

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
  const response = await httpClient.get<GoogleLoginLinkResponse>(
    "/auth/google-link",
    {
      skipAuthRefresh: true,
    },
  );

  return response.data;
}

