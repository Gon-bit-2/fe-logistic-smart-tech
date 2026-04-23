import type { ReactNode } from "react";
import AuthHeroPanel from "@/features/auth/presentation/components/AuthHeroPanel";
import GuestGuard from "@/features/auth/presentation/components/GuestGuard";

type AuthScreenProps = Readonly<{
  children: ReactNode;
  variant: "auth" | "otp";
}>;

export default function AuthScreen({ children, variant }: AuthScreenProps) {
  return (
    <GuestGuard>
      <main className="flex min-h-screen flex-col bg-surface lg:flex-row">
        <AuthHeroPanel variant={variant} />
        <section className="flex min-h-screen w-full items-center justify-center bg-surface-container-lowest px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-md">
            {children}
          </div>
        </section>
      </main>
    </GuestGuard>
  );
}
