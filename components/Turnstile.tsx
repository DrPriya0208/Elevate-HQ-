"use client";

import { useEffect, useRef } from "react";

/*
 * Cloudflare Turnstile, the privacy-friendly "are you human" check. Place it inside a <form>:
 * the widget adds a hidden "cf-turnstile-response" field that the server action verifies
 * (lib/protection.ts). In "interaction-only" mode most visitors never see it; a small box
 * appears only when Cloudflare wants a click. Renders nothing when no site key is set.
 */

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile did not load")));
    script.onerror = () => {
      scriptPromise = null; // allow a retry on the next mount
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * @param pending the form's pending flag from useActionState. A token works only once, so when a
 *   submission finishes the widget fetches a fresh one for the next attempt.
 */
export default function Turnstile({ pending, className }: { pending: boolean; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (!SITE_KEY || !box.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !box.current) return;
        widgetId.current = api.render(box.current, {
          sitekey: SITE_KEY,
          theme: "light",
          size: "flexible",
          appearance: "interaction-only",
          "refresh-expired": "auto",
        });
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (wasPending.current && !pending && widgetId.current) window.turnstile?.reset(widgetId.current);
    wasPending.current = pending;
  }, [pending]);

  if (!SITE_KEY) return null;
  return <div ref={box} className={className} />;
}
