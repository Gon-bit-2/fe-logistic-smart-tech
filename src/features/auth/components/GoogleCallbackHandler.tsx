"use client";

import Link from "next/link";
import { startTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseGoogleCallbackParams } from "@/features/auth/lib/auth.utils";
import { setAuthSessionTokens } from "@/store/useAuthStore";

export default function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackParams = parseGoogleCallbackParams(searchParams);
  const isError =
    Boolean(callbackParams.errorMessage) ||
    !callbackParams.accessToken ||
    !callbackParams.refreshToken;
  const message = callbackParams.errorMessage
    ? callbackParams.errorMessage
    : !callbackParams.accessToken || !callbackParams.refreshToken
      ? "Google login did not return a complete session."
      : "Google login successful. Redirecting to the operations workspace...";

  useEffect(() => {
    if (isError) {
      return;
    }

    const accessToken = callbackParams.accessToken;
    const refreshToken = callbackParams.refreshToken;

    if (!accessToken || !refreshToken) {
      return;
    }

    setAuthSessionTokens({
      accessToken,
      refreshToken,
    });
    startTransition(() => {
      router.replace("/orders/create");
    });
  }, [
    callbackParams.accessToken,
    callbackParams.refreshToken,
    isError,
    router,
  ]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-on-surface">
          {isError ? "Google sign-in failed" : "Google sign-in callback"}
        </h1>
        <p className="text-sm leading-6 text-on-surface-variant">{message}</p>
      </header>

      <div
        className={`rounded-xl px-4 py-4 text-sm ${
          isError
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/8 text-on-surface"
        }`}
      >
        {isError
          ? "Review the error above and retry login."
          : "Your session tokens are being stored securely in the browser session."}
      </div>

      <footer className="flex items-center justify-between border-t border-outline-variant/10 pt-6 text-sm text-on-surface-variant">
        <Link href="/auth/login" className="font-semibold text-primary">
          Back to login
        </Link>
        <Link href="/tracking" className="font-semibold">
          Support
        </Link>
      </footer>
    </div>
  );
}
