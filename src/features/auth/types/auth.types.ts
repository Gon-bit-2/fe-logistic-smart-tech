export type AuthFormMode = "login" | "register";

export type AuthStatus = "anonymous" | "authenticated";

export type VerificationCodeType = "FORGOT_PASSWORD" | "LOGIN" | "REGISTER";

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
