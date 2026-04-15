export type AuthRole = "admin" | "driver" | "customer";

export type AuthFormMode = "login" | "register";

export type AuthCredentials = {
  email: string;
  password: string;
  name?: string;
  organization?: string;
  phone?: string;
  role?: AuthRole;
};

export type OtpChallenge = {
  id: string;
  destination: string;
  maskedDestination: string;
  channel: "email" | "sms";
  expiresAt: string;
};

export type OtpVerificationInput = {
  challengeId: string;
  code: string;
};
