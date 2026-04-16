import { Suspense } from "react";
import AuthScreen from "@/features/auth/components/AuthScreen";
import GoogleCallbackHandler from "@/features/auth/components/GoogleCallbackHandler";

export default function GoogleCallbackPage() {
  return (
    <AuthScreen variant="auth">
      <Suspense
        fallback={
          <div className="rounded-xl bg-primary/8 px-4 py-4 text-sm text-on-surface">
            Finalizing Google sign-in...
          </div>
        }
      >
        <GoogleCallbackHandler />
      </Suspense>
    </AuthScreen>
  );
}
