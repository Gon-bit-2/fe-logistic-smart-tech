import { redirect } from "next/navigation";
import { defaultLocale, isSupportedLocale, localizePath } from "@/i18n/config";

export default async function CustomerNotificationsPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  redirect(`${localizePath("/overview", safeLocale)}?notifications=1`);
}
