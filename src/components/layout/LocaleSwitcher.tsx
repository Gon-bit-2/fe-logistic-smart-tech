"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { locales, stripLocale, type Locale } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = Readonly<{
  className?: string;
  tone?: "light" | "surface";
}>;

export default function LocaleSwitcher({
  className,
  tone = "surface",
}: LocaleSwitcherProps) {
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("language");
  const queryString = searchParams.toString();
  const canonicalPathname = stripLocale(pathname);
  const href = queryString ? `${canonicalPathname}?${queryString}` : canonicalPathname;

  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-full border p-1",
        tone === "light"
          ? "border-white/30 bg-white/10 text-white"
          : "border-outline-variant/20 bg-surface-container-lowest text-on-surface",
        className,
      )}
      aria-label={t("switcherLabel")}
    >
      <Languages className="mx-1 size-4 opacity-70" aria-hidden="true" />
      {locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <Link
            key={locale}
            href={href}
            locale={locale}
            replace
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-black uppercase transition-colors",
              isActive
                ? tone === "light"
                  ? "bg-white text-emerald-950"
                  : "bg-primary text-white"
                : tone === "light"
                  ? "text-white/75 hover:bg-white/10 hover:text-white"
                  : "text-on-surface/55 hover:bg-surface-container-low hover:text-primary",
            )}
            aria-current={isActive ? "true" : undefined}
            aria-label={t(locale)}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
