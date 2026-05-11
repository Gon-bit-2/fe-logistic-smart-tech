import { redirect } from "next/navigation";
import { getDashboardHrefForRole } from "@/features/auth/application/services/auth-session";
import { requireAuthenticatedSession } from "@/features/auth/application/services/server-auth";
import { localizePath, type Locale } from "@/i18n/config";

type DashboardPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const session = await requireAuthenticatedSession(locale as Locale);

  redirect(localizePath(getDashboardHrefForRole(session.profile.role), locale as Locale));
}
