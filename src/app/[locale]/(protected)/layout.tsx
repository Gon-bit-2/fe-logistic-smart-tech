import type { ReactNode } from "react";
import { requireAuthenticatedSession } from "@/features/auth/application/services/server-auth";
import type { Locale } from "@/i18n/config";

export default async function ProtectedLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  await requireAuthenticatedSession(locale as Locale);

  return (
    <div className="min-h-screen bg-surface">{children}</div>
  );
}
