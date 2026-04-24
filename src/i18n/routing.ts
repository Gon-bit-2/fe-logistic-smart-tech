import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/i18n/config";

export const routing = defineRouting({
  defaultLocale,
  localePrefix: "always",
  locales,
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
