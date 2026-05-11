"use client";

import { Link } from "@/i18n/routing";
import { startTransition, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { parseGoogleCallbackParams } from "@/features/auth/application/services/auth.utils";
import { exchangeGoogleSession } from "@/features/auth/infrastructure/api/auth.api";
import { setAuthSession } from "@/features/auth/presentation/state/auth.store";
import { useI18nCopy } from "@/i18n/useCopy";

export default function GoogleCallbackHandler() {
  const { googleCallbackCopy } = useI18nCopy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackParams = parseGoogleCallbackParams(searchParams);
  const isError =
    Boolean(callbackParams.errorMessage) ||
    !callbackParams.sessionToken;
  const message = callbackParams.errorMessage
    ? callbackParams.errorMessage
    : !callbackParams.sessionToken
      ? googleCallbackCopy.incompleteSession
      : googleCallbackCopy.loginSuccess;

  useEffect(() => {
    if (isError) {
      return;
    }

    const sessionToken = callbackParams.sessionToken;

    if (!sessionToken) {
      return;
    }

    let isCancelled = false;

    void exchangeGoogleSession(sessionToken)
      .then((session) => {
        if (isCancelled) {
          return;
        }

        setAuthSession(session);
        startTransition(() => {
          router.replace("/dashboard");
        });
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        startTransition(() => {
          router.replace("/auth/login?error=google-session-expired");
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [
    callbackParams.sessionToken,
    isError,
    router,
  ]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-on-surface">
          {isError ? googleCallbackCopy.errorTitle : googleCallbackCopy.successTitle}
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
          ? googleCallbackCopy.errorCard
          : googleCallbackCopy.secureSessionCard}
      </div>

      <footer className="flex items-center justify-between border-t border-outline-variant/10 pt-6 text-sm text-on-surface-variant">
        <Link href="/auth/login" className="font-semibold text-primary">
          {googleCallbackCopy.backToLogin}
        </Link>
        <Link href="/tracking" className="font-semibold">
          {googleCallbackCopy.support}
        </Link>
      </footer>
    </div>
  );
}
