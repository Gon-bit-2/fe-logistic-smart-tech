import ErrorExperience from "@/components/ui/error-experience";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <ErrorExperience
      content={{
        code: t("code"),
        checklist: [
          t("checklist.0"),
          t("checklist.1"),
          t("checklist.2"),
        ],
        description: t("description"),
        eyebrow: t("eyebrow"),
        insights: [
          { label: t("insights.status"), value: t("insights.statusValue") },
          { label: t("insights.impact"), value: t("insights.impactValue") },
          { label: t("insights.recovery"), value: t("insights.recoveryValue") },
        ],
        links: [
          { href: "/", label: t("links.home"), variant: "ghost" },
          { href: "/auth/login", label: t("links.login"), variant: "ghost" },
          { href: "/tracking", label: t("links.tracking"), variant: "ghost" },
        ],
        primaryAction: { label: t("primaryAction"), href: "/", variant: "default" },
        secondaryAction: { label: t("secondaryAction"), href: "/auth/login", variant: "outline" },
        title: t("title"),
        tone: "emerald",
      }}
    />
  );
}
