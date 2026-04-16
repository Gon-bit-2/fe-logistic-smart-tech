import type {
  ForgotPasswordDraft,
  GoogleCallbackParams,
  OtpChallengeMeta,
  RegisterDraft,
  VerificationCodeType,
} from "@/features/auth/types/auth.types";

type SearchParamsLike = {
  get(name: string): string | null;
};

function maskEmail(email: string) {
  const [localPart = "", domain = ""] = email.split("@");
  const visibleLength = Math.min(2, localPart.length);
  const maskedLength = Math.max(localPart.length - visibleLength, 2);

  return `${localPart.slice(0, visibleLength)}${"*".repeat(maskedLength)}@${domain}`;
}

export function buildOtpChallenge(
  email: string,
  type: VerificationCodeType,
): OtpChallengeMeta {
  return {
    channel: "email",
    destination: email,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    maskedDestination: maskEmail(email),
    type,
  };
}

export function toRegisterDraft(input: RegisterDraft): RegisterDraft {
  return {
    email: input.email.trim(),
    fullName: input.fullName.trim(),
    organization: input.organization?.trim() || undefined,
    password: input.password,
    phone: input.phone?.trim() || undefined,
  };
}

export function toForgotPasswordDraft(
  input: ForgotPasswordDraft,
): ForgotPasswordDraft {
  return {
    confirmPassword: input.confirmPassword,
    email: input.email.trim(),
    password: input.password,
  };
}

export function parseGoogleCallbackParams(
  searchParams: SearchParamsLike,
): GoogleCallbackParams {
  return {
    accessToken: searchParams.get("accessToken"),
    errorMessage: searchParams.get("errorMessage"),
    refreshToken: searchParams.get("refreshToken"),
  };
}
