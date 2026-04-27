import type { ReactNode } from "react";
import type { UserRole } from "@/features/auth/domain/types/auth.types";

export interface AuthGuardProps {
  readonly children: ReactNode;
}

export interface GuestGuardProps {
  readonly children: ReactNode;
}

export interface RoleGuardProps {
  readonly allowedRoles: UserRole[];
  readonly children: ReactNode;
}

export type AuthHeroPanelProps = Readonly<{
  variant: "auth" | "otp";
}>;

export type AuthScreenProps = Readonly<{
  children: ReactNode;
  variant: "auth" | "otp";
}>;
