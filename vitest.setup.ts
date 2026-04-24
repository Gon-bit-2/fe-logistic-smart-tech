import { createElement } from "react";
import type { ReactNode } from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { nextNavigationMock, resetNextNavigationMocks } from "@/test/next-navigation";

vi.mock("next/navigation", () => nextNavigationMock);
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();

  return {
    ...actual,
    useLocale: () => "vi",
    useTranslations: () => (key: string) => key,
  };
});
vi.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) =>
    createElement(
      "a",
      {
        href,
        ...props,
      },
      children,
    ),
  redirect: vi.fn(),
  usePathname: nextNavigationMock.usePathname,
  useRouter: nextNavigationMock.useRouter,
}));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { alt, src, ...rest } = props;
    return createElement("img", {
      alt,
      src,
      ...rest,
    });
  },
}));

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  resetNextNavigationMocks();
});

// Mock matchMedia if needed for some UI libraries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
