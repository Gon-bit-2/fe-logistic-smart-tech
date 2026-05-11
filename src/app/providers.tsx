"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState, type ComponentType, type ReactNode } from "react";
import { initializeAuthStore } from "@/features/auth/presentation/state/auth.store";
import { createQueryClient } from "@/lib/query-client";

const extensionAttributeNames = [
  "bis_skin_checked",
  "bis_use",
  "data-bis-config",
  "data-dynamic-id",
];

const extensionAttributeSelector = extensionAttributeNames
  .map((attributeName) => `[${attributeName}]`)
  .join(",");

function stripExtensionAttributes(root: Document | Element) {
  if (root instanceof Element) {
    extensionAttributeNames.forEach((attributeName) => {
      root.removeAttribute(attributeName);
    });
  }

  root.querySelectorAll?.(extensionAttributeSelector).forEach((element) => {
    extensionAttributeNames.forEach((attributeName) => {
      element.removeAttribute(attributeName);
    });
  });
}

type ReactQueryDevtoolsComponent = ComponentType<{
  initialIsOpen?: boolean;
}>;

function DevelopmentQueryDevtools() {
  const [Devtools, setDevtools] = useState<ReactQueryDevtoolsComponent | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    let isCancelled = false;

    void import("@tanstack/react-query-devtools").then((module) => {
      if (!isCancelled) {
        setDevtools(() => module.ReactQueryDevtools);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!Devtools) {
    return null;
  }

  return <Devtools initialIsOpen={false} />;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  useEffect(() => {
    initializeAuthStore();
  }, []);

  useLayoutEffect(() => {
    stripExtensionAttributes(document);

    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          stripExtensionAttributes(mutation.target);
        }

        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            stripExtensionAttributes(node);
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      attributeFilter: extensionAttributeNames,
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <DevelopmentQueryDevtools />
    </QueryClientProvider>
  );
}
