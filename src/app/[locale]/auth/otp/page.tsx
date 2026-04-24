import { Suspense } from "react";
import AuthScreen from "@/features/auth/presentation/screens/AuthScreen";
import OtpVerificationForm from "@/features/auth/presentation/components/OtpVerificationForm";

export default function OtpPage() {
  return (
    <AuthScreen variant="otp">
      <Suspense
        fallback={
          <div className="rounded-xl bg-primary/8 px-4 py-4 text-sm text-on-surface">
            Loading verification flow...
          </div>
        }
      >
        <OtpVerificationForm />
      </Suspense>
    </AuthScreen>
  );
}

