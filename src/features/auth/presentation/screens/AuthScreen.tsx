import type { ReactNode } from "react";
import AuthHeroPanel from "@/features/auth/presentation/components/AuthHeroPanel";

type AuthScreenProps = Readonly<{
  children: ReactNode;
  variant: "auth" | "otp";
}>;

export default function AuthScreen({ children, variant }: AuthScreenProps) {
  return (
    <main className="flex min-h-screen bg-surface">
      <AuthHeroPanel variant={variant} />
      <section className="flex min-h-screen w-full items-center justify-center bg-surface-container-lowest px-6 py-12 md:px-16 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}

