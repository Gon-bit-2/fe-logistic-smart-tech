"use client";

import { useEffect, useState, type RefObject } from "react";

type IdleCapableWindow = Window & {
  cancelIdleCallback?: (handle: number) => void;
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
};

export function useIdleSceneMount() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    let animationFrameId: number | null = null;
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const idleWindow = window as IdleCapableWindow;

    const scheduleMount = () => {
      setShouldMount(true);
    };

    animationFrameId = window.requestAnimationFrame(() => {
      if (idleWindow.requestIdleCallback) {
        idleCallbackId = idleWindow.requestIdleCallback(scheduleMount, {
          timeout: 1200,
        });
        return;
      }

      timeoutId = setTimeout(scheduleMount, 180);
    });

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (idleCallbackId !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return shouldMount;
}

export function useViewportSceneMount(
  targetRef: RefObject<Element | null>,
  rootMargin = "240px 0px",
) {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount || !targetRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      },
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, shouldMount, targetRef]);

  return shouldMount;
}
