import type {
  OtpChallengeMeta,
  RegisterDraft,
} from "@/features/auth/types/auth.types";

function maskEmail(email: string) {
  const [localPart = "", domain = ""] = email.split("@");
  const visibleLength = Math.min(2, localPart.length);
  const maskedLength = Math.max(localPart.length - visibleLength, 2);

  return `${localPart.slice(0, visibleLength)}${"*".repeat(maskedLength)}@${domain}`;
}

export function buildRegisterOtpChallenge(email: string): OtpChallengeMeta {
  return {
    channel: "email",
    destination: email,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    maskedDestination: maskEmail(email),
    type: "REGISTER",
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
