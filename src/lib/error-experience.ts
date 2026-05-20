import { useTranslations } from "next-intl";

export type ErrorExperienceAction = {
  label: string;
  href?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
};

export type ErrorExperienceContent = {
  code: string;
  checklist: string[];
  description: string;
  eyebrow: string;
  insights: Array<{
    label: string;
    value: string;
  }>;
  links: ErrorExperienceAction[];
  primaryAction: ErrorExperienceAction;
  secondaryAction?: ErrorExperienceAction;
  title: string;
  tone: "emerald" | "amber" | "rose" | "sky";
};

function normalizeMessage(message?: string) {
  return message?.trim() || "";
}

function isConfigurationError(message: string) {
  return /cấu hình|configuration|env|api chưa được cấu hình/i.test(message);
}

function isNetworkError(message: string) {
  return /fetch|network|timeout|timed out|econn|không thể tải|kết nối/i.test(message);
}

function isMissingResourceError(message: string) {
  return /không tìm thấy|not found|missing/i.test(message);
}

export function useGlobalErrorContent(error: Error & { digest?: string }): ErrorExperienceContent {
  const t = useTranslations("errorExperience.global");
  const tCommon = useTranslations("errorExperience.common");
  const message = normalizeMessage(error.message);
  
  const toReference = (digest?: string) => {
    return digest ? `#${digest}` : tCommon("noReference");
  };

  const reference = toReference(error.digest);

  if (isConfigurationError(message)) {
    return {
      code: "503",
      checklist: [
        t("configuration.checklist.0"),
        t("configuration.checklist.1"),
        t("configuration.checklist.2"),
      ],
      description: t("configuration.description"),
      eyebrow: t("configuration.eyebrow"),
      insights: [
        { label: t("configuration.insights.group"), value: t("configuration.insights.groupValue") },
        { label: t("configuration.insights.impact"), value: t("configuration.insights.impactValue") },
        { label: t("configuration.insights.reference"), value: reference },
      ],
      links: [
        { href: "/", label: t("configuration.links.home"), variant: "ghost" },
        { href: "/auth/login", label: t("configuration.links.login"), variant: "ghost" },
      ],
      primaryAction: { label: t("configuration.primaryAction"), href: "/" },
      secondaryAction: { label: t("configuration.secondaryAction"), href: "/auth/login", variant: "outline" },
      title: t("configuration.title"),
      tone: "amber",
    };
  }

  if (isNetworkError(message)) {
    return {
      code: "502",
      checklist: [
        t("network.checklist.0"),
        t("network.checklist.1"),
        t("network.checklist.2"),
      ],
      description: t("network.description"),
      eyebrow: t("network.eyebrow"),
      insights: [
        { label: t("network.insights.group"), value: t("network.insights.groupValue") },
        { label: t("network.insights.impact"), value: t("network.insights.impactValue") },
        { label: t("network.insights.reference"), value: reference },
      ],
      links: [
        { href: "/", label: t("network.links.home"), variant: "ghost" },
        { href: "/tracking", label: t("network.links.tracking"), variant: "ghost" },
      ],
      primaryAction: { label: t("network.primaryAction"), variant: "default" },
      secondaryAction: { label: t("network.secondaryAction"), href: "/", variant: "outline" },
      title: t("network.title"),
      tone: "sky",
    };
  }

  return {
    code: "500",
    checklist: [
      t("unknown.checklist.0"),
      t("unknown.checklist.1"),
      t("unknown.checklist.2"),
    ],
    description: t("unknown.description"),
    eyebrow: t("unknown.eyebrow"),
    insights: [
      { label: t("unknown.insights.group"), value: t("unknown.insights.groupValue") },
      { label: t("unknown.insights.message"), value: message || t("unknown.insights.messageFallback") },
      { label: t("unknown.insights.reference"), value: reference },
    ],
    links: [
      { href: "/", label: t("unknown.links.home"), variant: "ghost" },
      { href: "/dashboard", label: t("unknown.links.dashboard"), variant: "ghost" },
    ],
    primaryAction: { label: t("unknown.primaryAction"), variant: "default" },
    secondaryAction: { label: t("unknown.secondaryAction"), href: "/", variant: "outline" },
    title: t("unknown.title"),
    tone: "rose",
  };
}

export function useDashboardErrorContent(
  error: Error & { digest?: string },
): ErrorExperienceContent {
  const t = useTranslations("errorExperience.dashboard");
  const tCommon = useTranslations("errorExperience.common");
  const message = normalizeMessage(error.message);
  
  const toReference = (digest?: string) => {
    return digest ? `#${digest}` : tCommon("noReference");
  };

  const reference = toReference(error.digest);

  if (isConfigurationError(message)) {
    return {
      code: "CFG",
      checklist: [
        t("configuration.checklist.0"),
        t("configuration.checklist.1"),
        t("configuration.checklist.2"),
      ],
      description: t("configuration.description"),
      eyebrow: t("configuration.eyebrow"),
      insights: [
        { label: t("configuration.insights.impact"), value: t("configuration.insights.impactValue") },
        { label: t("configuration.insights.type"), value: t("configuration.insights.typeValue") },
        { label: t("configuration.insights.reference"), value: reference },
      ],
      links: [
        { href: "/dashboard", label: t("configuration.links.dashboard"), variant: "ghost" },
        { href: "/", label: t("configuration.links.home"), variant: "ghost" },
      ],
      primaryAction: { label: t("configuration.primaryAction"), variant: "default" },
      secondaryAction: { label: t("configuration.secondaryAction"), href: "/dashboard", variant: "outline" },
      title: t("configuration.title"),
      tone: "amber",
    };
  }

  if (isMissingResourceError(message)) {
    return {
      code: "404",
      checklist: [
        t("missingResource.checklist.0"),
        t("missingResource.checklist.1"),
        t("missingResource.checklist.2"),
      ],
      description: t("missingResource.description"),
      eyebrow: t("missingResource.eyebrow"),
      insights: [
        { label: t("missingResource.insights.impact"), value: t("missingResource.insights.impactValue") },
        { label: t("missingResource.insights.type"), value: t("missingResource.insights.typeValue") },
        { label: t("missingResource.insights.reference"), value: reference },
      ],
      links: [
        { href: "/dashboard", label: t("missingResource.links.dashboard"), variant: "ghost" },
        { href: "/orders", label: t("missingResource.links.orders"), variant: "ghost" },
      ],
      primaryAction: { label: t("missingResource.primaryAction"), href: "/dashboard", variant: "default" },
      secondaryAction: { label: t("missingResource.secondaryAction"), href: "/orders", variant: "outline" },
      title: t("missingResource.title"),
      tone: "sky",
    };
  }

  if (isNetworkError(message)) {
    return {
      code: "SYNC",
      checklist: [
        t("network.checklist.0"),
        t("network.checklist.1"),
        t("network.checklist.2"),
      ],
      description: t("network.description"),
      eyebrow: t("network.eyebrow"),
      insights: [
        { label: t("network.insights.impact"), value: t("network.insights.impactValue") },
        { label: t("network.insights.type"), value: t("network.insights.typeValue") },
        { label: t("network.insights.reference"), value: reference },
      ],
      links: [
        { href: "/dashboard", label: t("network.links.dashboard"), variant: "ghost" },
        { href: "/notifications", label: t("network.links.notifications"), variant: "ghost" },
      ],
      primaryAction: { label: t("network.primaryAction"), variant: "default" },
      secondaryAction: { label: t("network.secondaryAction"), href: "/dashboard", variant: "outline" },
      title: t("network.title"),
      tone: "sky",
    };
  }

  return {
    code: "OPS",
    checklist: [
      t("unknown.checklist.0"),
      t("unknown.checklist.1"),
      t("unknown.checklist.2"),
    ],
    description: t("unknown.description"),
    eyebrow: t("unknown.eyebrow"),
    insights: [
      { label: t("unknown.insights.impact"), value: t("unknown.insights.impactValue") },
      { label: t("unknown.insights.message"), value: message || t("unknown.insights.messageFallback") },
      { label: t("unknown.insights.reference"), value: reference },
    ],
    links: [
      { href: "/dashboard", label: t("unknown.links.dashboard"), variant: "ghost" },
      { href: "/", label: t("unknown.links.home"), variant: "ghost" },
    ],
    primaryAction: { label: t("unknown.primaryAction"), variant: "default" },
    secondaryAction: { label: t("unknown.secondaryAction"), href: "/dashboard", variant: "outline" },
    title: t("unknown.title"),
    tone: "rose",
  };
}
