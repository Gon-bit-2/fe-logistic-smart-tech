import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import "./globals.css";
import { appMetadata } from "@/i18n/vi";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: appMetadata.title,
  description: appMetadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="strip-bis-attributes" strategy="beforeInteractive">
          {`
            (() => {
              const attributeName = "bis_skin_checked";

              const stripAttribute = (root) => {
                if (!(root instanceof Element || root instanceof Document)) {
                  return;
                }

                if (root instanceof Element && root.hasAttribute(attributeName)) {
                  root.removeAttribute(attributeName);
                }

                root
                  .querySelectorAll?.("[" + attributeName + "]")
                  .forEach((element) => element.removeAttribute(attributeName));
              };

              stripAttribute(document);

              const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                  if (mutation.type === "attributes" && mutation.target instanceof Element) {
                    if (mutation.target.hasAttribute(attributeName)) {
                      mutation.target.removeAttribute(attributeName);
                    }
                  }

                  for (const node of mutation.addedNodes) {
                    stripAttribute(node);
                  }
                }
              });

              observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: [attributeName],
                childList: true,
                subtree: true,
              });

              window.addEventListener("load", () => observer.disconnect(), { once: true });
            })();
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
